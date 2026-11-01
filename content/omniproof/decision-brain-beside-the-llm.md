A language model is a whole brain in one box. It reads, plans, explains and writes. Ask it whether to brake, though, and it answers the way it answers everything: it reads the question, thinks, and writes a reply one token at a time. On a good day that takes a few hundred milliseconds. Often it takes a second or two.

A chatbot can afford that delay. A machine that moves cannot. A car at 100 km/h covers about 28 metres a second, so a model that takes a second and a half to decide has let the car travel 40 metres before anything happens. A robot hand closing on a glass needs a correction many times a second, and an aircraft converging with another one has very little time to choose which way to turn.

Machines that act in the physical world need a second, smaller brain with one job: take the situation as it is right now and pick an action, quickly and the same way every time.

## The part of the brain that picks

Our own brains split the work. The cortex does the slow, deliberate thinking, the kind that weighs options and puts them into words. Deep under it sit the basal ganglia, a set of nuclei that neuroscientists link most closely to action selection. In the leading model, one pathway pushes the chosen action forward while another holds the alternatives back, so the body commits to one move at a time. Researchers still argue over how much of the choosing the basal ganglia do themselves and how much they set the urgency for choices made in the cortex. Either way, the fast "go or don't go" runs in a different circuit from the slow reasoning.

Psychologists describe the same split as System 1 and System 2: fast, automatic judgment beside slow, effortful thought. An LLM is a System 2 machine. Robots and aircraft also need a System 1.

## Robots already work this way

Figure AI built its Helix model for humanoid robots on this split. A seven-billion-parameter vision-language model, which Figure calls System 2, understands the scene and the spoken instruction and updates its plan seven to nine times a second. Beside it, an 80-million-parameter network, System 1, turns that plan into motor commands for the wrists, fingers, torso and head 200 times a second. The large model decides what to do, and the small one keeps the hand on the object while the large one is still thinking.

The fast model is nearly a hundred times smaller. It answers one narrow question over and over and never has to put anything into words.

## Aircraft have done it for decades

Collision avoidance is the older example. ACAS Xu, the version being built for drones, picks its advisories from a table computed in advance by optimising over the encounters its designers could model. The table took about two gigabytes. Researchers compressed it into 45 small neural networks totalling 2.4 megabytes, small enough to run on board, and in simulation the networks matched the table.

Later verification work found that an early quantised prototype could still steer into a collision the original system was meant to avoid. A fast decision model earns its place only when someone can check it. Because it answers one narrow question, it can be tested far more completely than a model that can say anything.

## What a decision model gives you

It is fast, because it returns an answer instead of writing one. It gives the same answer to the same input, which matters when a system has to be certified or debugged after an incident. And it can report how sure it is, as a probability, so the system knows when to act at once and when to pass the case up.

That last property is what makes the pairing work. The small model decides by default and the large model takes the exceptions. When the decision model is confident, the robot moves or the software takes the branch. When it is unsure, the case goes to the LLM, which can take its time and reason about something it has not seen before.

## For teams building with AI

Most of what an AI system does in production is small decisions repeated many times: route this, flag that, stop or carry on. Sending each one to a frontier LLM costs money and time, and the answers drift from run to run. A decision model built for those questions handles the bulk of them and leaves the LLM for the work only it can do.

Start with the decision your system makes most often. Measure how long the LLM takes on it and how often its answer changes when you ask again. If either number matters, that decision is where your system needs its second brain.
