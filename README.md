# Test of Chivalry

Test of Chivalry analyzes the sentiment of both voice recordings and text by converting voice recordings to a transcript using AssemblyAi and then using Google Cloud Natural Language Processing to determine the sentiment of the overall message as well as each individual sentence.

We used Javascript, HTML, and CSS to call a series of APIs (AssemblyAI and then Google Cloud Natural Language Processing) based on an input on the page. The AssemblyAI API converted voice messages into transcripts, which we then uploaded to the Google Cloud Natural Language Processing API to analyze the sentiment of the overall message and each sentence. We then used the sentiment and magnitude score of the overall document to calculate the Chivalry Score of the message.

#Contributors:

Alex Rowe (github.com/andes0113)
- API Calls, Backend, Frontend


Rohan Prasad(github.com/Rprasad2400)
- Website Design, Frontend
