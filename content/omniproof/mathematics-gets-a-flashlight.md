For a few thousand years, mathematicians have walked through the woods with a candle. That is how Rutgers number theorist Alex Kontorovich put it on episode #503 of the Lex Fridman Podcast. "Now we have a flashlight."

The flashlight arrived over a few weeks this autumn. OpenAI released around seven hundred results its systems claim to have proved, some of them among the most famous open problems in the field. Anthropic's systems produced a complete machine-checked proof of Fermat's Last Theorem, thirteen million lines of code built up from the axioms. Lex sat down with Kontorovich, MIT theoretical computer scientist Ankur Moitra and University of Washington fluid dynamicist Steven Brunton to work out what it means.

## What fell

**The quasi-Riemann hypothesis.** The Riemann hypothesis says where the zeros of one particular function sit, and those zeros control how the prime numbers are spread out. The best known zero-free region had not moved in seventy years. The new proof clears an entire vertical strip: no zeros with real part between 7/8 and 1. Get 7/8 down to 1/2 and you have the full Riemann hypothesis. Kontorovich did not expect to see this in his lifetime.

**A Navier-Stokes blow-up.** These equations describe how fluids move, and one of the Clay Millennium problems asks whether they can break down, with the flow racing to infinity in finite time. The AI built a case where they do. A carefully tuned, smooth outside force feeds a single vortex that stretches and thins, like a figure skater pulling in their arms, until its spin becomes infinite.

**The Unique Games Conjecture.** This one asks how well we can approximate answers to hard optimisation problems. If it is true, then for a huge family of problems we know the best possible approximation algorithm, and it is usually a simple one. The release says it is true. Moitra points out that people had already laid the road: Dor Minzer and Irit Dinur's Two-to-One theorem made it look reachable by humans within ten or twenty years.

Smaller surprises came with them: a faster algorithm for 3SUM, a coding-interview staple a whole sub-field had bet could not be sped up, and tighter constants for the Fast Fourier Transform.

## How it was actually done

The remarkable part is not that a model wrote a proof. Language models make things up, and Kontorovich says plainly that their proofs in ordinary prose cannot be trusted. What changed is the checker.

Lean is software that verifies a proof line by line, all the way down to the axioms. Mathlib is the large shared library of mathematics written in it. The AI writes its proof in Lean, and Lean either accepts it or does not. The quasi-Riemann statement was already in Mathlib, so when a proof came back with no gaps, Kontorovich was fully confident it was correct before he had worked through every detail.

That is the pattern to notice: a fast, fallible generator paired with a slow, strict verifier. The machine searches, the checker keeps it honest, and people decide which questions matter and what the answers mean. Moitra says the proofs "just don't look like a human has solved those problems." They are long and unpolished. Turning them into clean mathematics that others can build on is still human work.

## The business impact

Brunton gave the economics in one line: "We solved the million-dollar math problem. There's a trillion-dollar engineering problem." The Navier-Stokes proof lives in a regime too extreme to show up in a wind tunnel. Fluids are as hard to simulate today as they were last month, and aircraft drag, artificial hearts and turbines still eat supercomputer time.

So the money is in the method, not the theorems. Brunton sorts uses of AI on two axes: how easily you can check the output, and how much it costs when the output is wrong. A bad proof costs nothing and is caught at once. A bad wing design costs one wind-tunnel test. Those are the places to put AI to work now. Where mistakes are expensive and hard to catch, he wants a firewall.

For a company the lesson is concrete. Wherever you have a verifier, such as a test suite, a simulator, a type checker or a lab assay, AI search can run. Where you don't have one, build it first.

The episode also points at what sits under commerce. Online payments depend on nobody knowing how to factor huge numbers quickly. None of the seven hundred results touched that. If one ever does, Moitra says, "all of e-commerce is gone."

## The impact on society

The mood among mathematicians is mixed. Terence Tao wrote that he was "horrified" to see years of patient work by graduate students "casually disrupted" by a single release. Moitra worries about advising young researchers now that the old playbook for making a name has been thrown out. Programmers went through the same shock late last year.

But nobody on the panel thinks mathematics is finished. Kontorovich argues that pure mathematics matters because it lives in human heads; a theorem sitting in a data centre explains nothing to anyone. All three see the field becoming more like big science: shared libraries, collective checking, and papers that tell the story while the Lean code carries the proof.

For everyone else, the change is access. Moitra calls these tools "a world expert who's there to teach you about things in your own language". That expert is now available to a student in any town, not only in a Princeton seminar room.

Mathematics is the first field where AI's work can be checked completely. That makes it the test case for all the others.
