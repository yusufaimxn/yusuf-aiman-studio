"""Offline tests: no network, no provider keys. Run: python -m unittest discover -s voice/tests"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

VOICE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(VOICE))

from yavoice import consent, delivery, enroll, lexicon, script  # noqa: E402
from yavoice.providers import ConsentRequired, ProviderError, get_provider  # noqa: E402
from yavoice.providers.elevenlabs import chars_to_words  # noqa: E402

EXAMPLE = (VOICE / "examples" / "apa-itu-api.txt").read_text()


def tone(path, seconds=8, noise=0.0, vol=0.3):
    src = f"sine=f=220:d={seconds}"
    af = f"volume={vol}"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", src]
    if noise:
        cmd += ["-f", "lavfi", "-i", f"anoisesrc=a={noise}:d={seconds}", "-filter_complex", f"[0][1]amix=2,{af}"]
    else:
        cmd += ["-af", af]
    subprocess.run(cmd + ["-ar", "44100", str(path)], check=True)
    return path


class ScriptTests(unittest.TestCase):
    def test_parse_and_segments(self):
        s = script.parse(EXAMPLE)
        self.assertEqual(s.meta["title"], "Apa itu API?")
        self.assertEqual([l.speaker for l in s.lines], ["YUSUF", "AIMAN", "YUSUF", "AIMAN", "YUSUF", "YUSUF"])
        self.assertEqual(s.lines[1].sfx_after, ["boing"])
        self.assertEqual(s.lines[4].language, "en")
        self.assertIn("response dalam format JSON", s.lines[2].text)  # continuation joined
        segs = s.segments()
        self.assertTrue(all(len(x.text) <= script.MAX_SEGMENT_CHARS for x in segs))
        self.assertEqual(len({x.id for x in segs}), len(segs))

    def test_bad_emotion_rejected(self):
        with self.assertRaises(ValueError):
            script.parse("YUSUF (angry-ish): hi")

    def test_abbreviation_not_split(self):
        self.assertEqual(len(script.split_sentences("Contoh e.g. Python dan Java. Lepas tu kita sambung.")), 1)


class LexiconTests(unittest.TestCase):
    def test_alias_only_in_malay(self):
        lx = lexicon.Lexicon.load()
        ms, hits = lx.apply("Kita guna API dan JSON.", "ms")
        self.assertIn("ei-pi-ai", ms)
        self.assertIn("API", hits)
        en, _ = lx.apply("We use an API.", "en")
        self.assertIn("API", en)

    def test_unknown_terms(self):
        self.assertIn("OAuth", lexicon.Lexicon.load().unknown_terms("Guna OAuth untuk login"))


class DeliveryTests(unittest.TestCase):
    prof = {"base_speed": 1.0, "provider": "elevenlabs", "provider_settings": {"stability": 0.5},
            "delivery_limits": {"max_speed_deviation": 0.08}}

    def test_strategies(self):
        el2 = get_provider("elevenlabs").capabilities("eleven_multilingual_v2")
        el3 = get_provider("elevenlabs").capabilities("eleven_v3")
        ca = get_provider("cartesia").capabilities("sonic-3.6")
        d = delivery.Delivery("excited")
        self.assertEqual(delivery.plan("Wah", d, el3, "ms", self.prof).text, "[excited] Wah")
        p2 = delivery.plan("Wah", d, el2, "ms", self.prof)
        self.assertEqual(p2.strategy, "voice_settings")
        self.assertTrue(p2.text.endswith("!"))
        # Cartesia emotion is English-only: Malay line must not get an emotion value
        self.assertIsNone(delivery.plan("Wah", d, ca, "ms", {"base_speed": 1.0}).emotion_value)
        self.assertEqual(delivery.plan("Wow", d, ca, "en", {"base_speed": 1.0}).emotion_value, "excited")

    def test_speed_capped_by_profile(self):
        el2 = get_provider("elevenlabs").capabilities("eleven_multilingual_v2")
        p = delivery.plan("x", delivery.Delivery("excited", speed=1.5), el2, "ms", self.prof)
        self.assertLessEqual(p.speed, 1.08)

    def test_all_fifteen(self):
        self.assertEqual(len(delivery.EMOTIONS), 15)
        self.assertEqual(set(delivery.EMOTIONS), set(delivery.SPECS))


class EnrollAndConsentTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self._old = enroll.SAMPLES
        enroll.SAMPLES = self.tmp / "samples"

    def tearDown(self):
        enroll.SAMPLES = self._old
        shutil.rmtree(self.tmp)

    def test_qa_and_consent_gate(self):
        good = tone(self.tmp / "good.wav", 8, vol=0.1)
        short = tone(self.tmp / "short.wav", 2, vol=0.1)
        hot = tone(self.tmp / "hot.wav", 6, vol=12.0)
        man = enroll.Manifest("TEST")
        g, s, h = man.add(good), man.add(short), man.add(hot)
        self.assertTrue(g["qa"]["passed"], g["qa"])
        self.assertFalse(s["qa"]["passed"])
        self.assertTrue(any("clipping" in i for i in h["qa"]["issues"]), h["qa"])
        with self.assertRaises(ValueError):
            man.set_status(s["sha256"][:10], "approved", "t")
        man.set_status(g["sha256"][:10], "approved", "t")
        paths = man.approved_paths()
        self.assertEqual(len(paths), 1)
        with self.assertRaises(ConsentRequired):
            consent.verify_consent(None, "elevenlabs", paths)
        rec = {"speaker": "Yusuf Aiman", "confirmed_by_speaker": True, "statement": "x", "providers": ["elevenlabs"],
               "approved_sample_sha256": [g["sha256"]], "confirmed_at": "2026-11-26T00:00:00+00:00"}
        consent.verify_consent(rec, "elevenlabs", paths)
        with self.assertRaises(ConsentRequired):
            consent.verify_consent(rec, "cartesia", paths)
        with self.assertRaises(ConsentRequired):
            consent.verify_consent(rec, "elevenlabs", [self.tmp / "samples" / "TEST" / s["file"]])
        with self.assertRaises(ConsentRequired):
            consent.verify_consent(dict(rec, confirmed_by_speaker=False), "elevenlabs", paths)
        # The provider adapter enforces consent before any network call
        from yavoice.providers import CloneRequest
        with self.assertRaises(ConsentRequired):
            get_provider("elevenlabs").create_clone(CloneRequest("x", paths, "ms"), None)


class ProfileTests(unittest.TestCase):
    def test_stored_voice_id_and_env_override(self):
        from yavoice.profiles import resolve
        os.environ.pop("YUSUF_VOICE_ID", None)
        self.assertEqual(resolve("YUSUF").voice_id, "G3mZ5fAxCu3ThFPWdD3D")
        self.assertEqual(resolve("AIMAN").voice_id, "NHFTLozDZneDWyQjRGAO")
        os.environ["YUSUF_VOICE_ID"] = "override"
        try:
            self.assertEqual(resolve("YUSUF").voice_id, "override")
        finally:
            os.environ.pop("YUSUF_VOICE_ID")

    def test_no_voice_without_selection(self):
        from yavoice.profiles import resolve
        os.environ.pop("YUSUF_VOICE_ID_GOOGLE", None)
        with self.assertRaises(ProviderError):
            resolve("YUSUF", provider_override="google")

    def test_aiman_does_not_use_yusuf_by_default(self):
        from yavoice.profiles import load_profile
        a = load_profile("AIMAN_CHARACTER_VOICE_V1")
        self.assertEqual(a["mode"], "synthetic")
        self.assertFalse(a["allow_yusuf_voice"])


class TimestampTests(unittest.TestCase):
    def test_chars_to_words(self):
        w = chars_to_words(list("Hai semua"), [0, .1, .2, .3, .4, .5, .6, .7, .8], [.1, .2, .3, .4, .5, .6, .7, .8, .9])
        self.assertEqual([x.word for x in w], ["Hai", "semua"])
        self.assertAlmostEqual(w[1].start, 0.4)


class PipelineMockTests(unittest.TestCase):
    def test_end_to_end_mock(self):
        from yavoice import pipeline, qa, sync
        from yavoice.post import Preset, master
        slug = "_test-mock"
        out = pipeline.episode_audio_dir(slug)
        shutil.rmtree(out.parents[2], ignore_errors=True)
        try:
            # Remote providers are refused without --allow-remote
            with self.assertRaises(ProviderError):
                os.environ["YUSUF_VOICE_ID"] = "x"
                pipeline.Pipeline(slug, EXAMPLE).run()
            os.environ.pop("YUSUF_VOICE_ID", None)
            p = pipeline.Pipeline(slug, EXAMPLE, provider_override="mock")
            res = p.run()
            self.assertTrue(res["placeholder_audio"])
            for f in ("narration.wav", "timeline.json", "captions.srt", "stems/yusuf.wav", "stems/aiman.wav"):
                self.assertTrue((out / f).exists(), f)
            segs = res["segments"]
            self.assertTrue(all(a["end"] <= b["start"] for a, b in zip(segs, segs[1:])))
            srt = (out / "captions.srt").read_text()
            self.assertIn("API", srt)  # captions keep original text, not the alias
            self.assertNotIn("ei-pi-ai", srt)
            cues = json.loads(sync.write_cues(out).read_text())
            self.assertIn("YUSUF", cues["mouth"])
            self.assertTrue(any(e["type"] == "sfx" for e in cues["events"]))
            r = qa.run_qa(out, final=True)
            self.assertFalse(r["passed"])  # placeholder audio must block final
            self.assertTrue(any(i["check"] == "placeholder" for i in r["issues"]))
            # Regenerating one segment creates a new take and leaves the others cached
            first = segs[0]["id"]
            before = {s["id"]: s["key"] for s in segs}
            res2 = pipeline.Pipeline(slug, EXAMPLE, provider_override="mock").run(regenerate={first})
            after = {s["id"]: s["key"] for s in res2["segments"]}
            self.assertEqual(res2["segments"][0]["take"], 2)
            self.assertEqual({k: v for k, v in before.items() if k != first},
                             {k: v for k, v in after.items() if k != first})
            mix = master(out / "narration.wav", out / "mix.wav", Preset.load("educational"),
                         tone(out / "bed.wav", 5, vol=0.2))
            from yavoice import ffmpeg
            loud = ffmpeg.loudness(mix)
            self.assertAlmostEqual(loud["lufs"], -14, delta=1.5)
            self.assertLessEqual(loud["true_peak"], -0.9)
        finally:
            shutil.rmtree(out.parents[2], ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
