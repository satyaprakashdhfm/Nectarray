Three different things are being sold as "AI" to small and mid-sized businesses right now: workflow automation, chatbots and agents. They solve different problems and cost very different amounts to build and run. Picking the wrong one usually means paying for an agent when a ₹20,000 automation would have done the job, or buying a chatbot and discovering it cannot actually do anything.

Here is how to tell them apart and choose.

## Automation: fixed steps, no judgement

An automation runs the same steps every time something happens. A form is submitted, so a row is added to a sheet, a WhatsApp message goes to the owner and the lead is created in the CRM. Tools like Zapier, Make and n8n do this, as does a small script on a server.

Automations are cheap, fast and predictable. They break when the input is messy or when the next step depends on reading and understanding something. "If the email is a complaint, send it to support" is already beyond a plain automation, because something has to decide what counts as a complaint.

## Chatbot: answers in words

A chatbot holds a conversation. A modern one uses a language model and your own documents to answer questions such as "what are your opening hours", "do you ship to Pune" or "how do I reset my password". It reduces the number of repetitive questions your team answers.

What a chatbot does not do is change anything. It can tell a customer the refund policy. It cannot issue the refund, update the order or book the pickup, unless someone connects it to those systems, and at that point it has become an agent.

## Agent: decides and acts

An agent is a language model with access to tools and permission to use them towards a goal. It reads the situation, decides what to do, calls a tool, looks at the result and continues. It can handle inputs that vary, because it reads them the way a person would.

That flexibility has costs. Agents need testing against real examples, limits on what they may do alone, logs of every step, and a person to approve anything that cannot be undone. They cost more to build and a little to run on every task.

![Automation, chatbot and agent compared on three rows: handles messy input, takes actions, cost to build.](/blog/ai-agent-vs-chatbot-vs-automation/diagram.svg "Each step up handles more variety and costs more to build and to run.")

## The same task, three ways

Take a clinic that gets appointment requests by email and WhatsApp.

With an automation, every message creates a task for the receptionist. Nothing is missed, but a person still reads each one and books it.

With a chatbot on the website, patients can ask about timings and doctors and get an answer at midnight. Bookings still go through the receptionist.

With an agent, the message is read, the patient's preferred doctor and time are worked out, the calendar is checked, two slots are offered, and the booking is made when the patient confirms. The receptionist sees a list of bookings and handles the ones the agent was unsure about.

All three are reasonable. Which one is right depends on how many requests arrive and how much of the receptionist's day they take.

## A quick test for choosing

Ask these in order and stop at the first yes.

1. Are the steps exactly the same every time, with clean input? Use an automation.
2. Is the main problem people asking the same questions, and the answer is in documents you already have? Use a chatbot.
3. Does the task need someone to read something, decide, and then act in one or more systems, many times a day? Consider an agent.

If you answered yes to the third, check two more things before you build. Is a mistake recoverable? And is there enough volume that saving a few minutes per task adds up to real hours? If either answer is no, start with automation plus a person, and revisit later.

## Costs, roughly

| | Automation | Chatbot | Agent |
|---|---|---|---|
| Typical build | Days | 1 to 3 weeks | 4 to 8 weeks |
| Rough build cost | ₹10,000 to ₹60,000 | ₹50,000 to ₹2 lakh | ₹4 lakh and up |
| Running cost | Tool subscription | Model usage per chat | Model usage per task, plus monitoring |
| Needs testing against examples | Rarely | Yes | Always |

These are broad ranges for the Indian market, and a quote for your own case can land outside them. The ratio between the three columns is the useful part.

## Mixing them is normal

Most working systems combine all three. An automation catches the incoming message and files it. An agent handles the part that needs judgement. A chatbot answers the customer while they wait. Good design puts each piece where it is cheapest and most reliable.

If you are unsure where your process sits, describe it to us in a few lines. If an automation does the job, that is what we will recommend.
