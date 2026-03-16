**vChat** is a general-purpose messaging app that makes vCon — an open IETF conversation data standard — accessible to everyone. Conversations are valuable, but they rarely come with a structured record of what was discussed, agreed, or decided. vChat changes that by automatically structuring every exchange into a signed, verifiable record that captures who said what, in what role, and when.

Conversations can be started natively inside the app or imported from existing platforms, both producing the same structured vCon output. When connected to an MCP server, AI capabilities become available directly on those conversations — enabling semantic search, insight generation, and much more.

Built for everyday people, vChat has applications across community mediation, healthcare, education, legal settings, and beyond — ensuring that conversations carry weight beyond the moment they happen.

This contains everything you need to run your app locally.

View the app in AI Studio: https://ai.studio/apps/8ab41ac1-4ef3-465d-bdb0-b997cfb44539

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
