<a href="https://colab.research.google.com/github/sunnysavita10/Indepth-GENAI/blob/main/RAG_With_Knowledge_graph(Neo4j).ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# langchain-core

contains simple, core abstractions that have emerged as a standard, as well as LangChain Expression Language as a way to compose these components together. This package is now at version 0.1 and all breaking changes will be accompanied by a minor version bump.

# langchain-community
contains all third party integrations. We will work with partners on splitting key integrations out into standalone packages over the next month.

# langchain
contains higher-level and use-case specific chains, agents, and retrieval algorithms that are at the core of your application's cognitive architecture. We are targeting a launch of a stable 0.1 release for langchain in early January.#

```python
%pip install --upgrade --quiet  langchain langchain-community langchain-openai langchain-experimental neo4j wikipedia tiktoken yfiles_jupyter_graphs
```

```result
Note: you may need to restart the kernel to use updated packages.
```

```result
ERROR: pip's dependency resolver does not currently take into account all the packages that are installed. This behaviour is the source of the following dependency conflicts.
crewai 0.30.11 requires langchain<0.2.0,>=0.1.10, but you have langchain 0.3.4 which is incompatible.
crewai 0.30.11 requires regex<2024.0.0,>=2023.12.25, but you have regex 2024.9.11 which is incompatible.
crewai-tools 0.2.6 requires langchain<0.2.0,>=0.1.4, but you have langchain 0.3.4 which is incompatible.
embedchain 0.1.102 requires langchain<0.2.0,>=0.1.4, but you have langchain 0.3.4 which is incompatible.
embedchain 0.1.102 requires langchain-openai<0.0.6,>=0.0.5, but you have langchain-openai 0.2.4 which is incompatible.
embedchain 0.1.102 requires tiktoken<0.6.0,>=0.5.2, but you have tiktoken 0.8.0 which is incompatible.
langchain-cohere 0.1.5 requires langchain-core<0.3,>=0.1.42, but you have langchain-core 0.3.13 which is incompatible.
langchain-google-genai 1.0.4 requires langchain-core<0.3,>=0.1.45, but you have langchain-core 0.3.13 which is incompatible.

[notice] A new release of pip is available: 24.2 -> 24.3.1
[notice] To update, run: python.exe -m pip install --upgrade pip
```

```python
from langchain_core.runnables import (
    RunnableBranch,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)
```

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
```

```python
from google.colab import userdata
OPENAI_API_KEY=userdata.get('OPENAI_API_KEY')
```

```python
from typing import Tuple, List, Optional
```

```python
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
```

```python
from langchain_core.runnables import ConfigurableField
```

```python
from yfiles_jupyter_graphs import GraphWidget
from neo4j import GraphDatabase
```

```python
import os
```

```python
try:
  import google.colab
  from google.colab import output
  output.enable_custom_widget_manager()
except:
  pass
```

```python
from langchain_community.vectorstores import Neo4jVector
```

```python
from google.colab import userdata
OPENAI_API_KEY=userdata.get('OPENAI_API_KEY')
```

```python
NEO4J_URI="neo4j+s://7b0ac3fd.databases.neo4j.io"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="REDACTED_NEO4J_PASSWORD"
```

```python
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["NEO4J_URI"] = NEO4J_URI
os.environ["NEO4J_USERNAME"] = NEO4J_USERNAME
os.environ["NEO4J_PASSWORD"] = NEO4J_PASSWORD
```

```python
from langchain_community.graphs import Neo4jGraph
```

```python
graph = Neo4jGraph()
```

```python
from langchain.document_loaders import WikipediaLoader
raw_documents = WikipediaLoader(query="Elizabeth I").load()
```

```result
/usr/local/lib/python3.10/dist-packages/wikipedia/wikipedia.py:389: GuessedAtParserWarning: No parser was explicitly specified, so I'm using the best available HTML parser for this system ("lxml"). This usually isn't a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.

The code that caused this warning is on line 389 of the file /usr/local/lib/python3.10/dist-packages/wikipedia/wikipedia.py. To get rid of this warning, pass the additional argument 'features="lxml"' to the BeautifulSoup constructor.

  lis = BeautifulSoup(html).find_all('li')
```

```python
len(raw_documents)
```

```result
23
```

```python
raw_documents[:3]
```

```result
[Document(page_content='Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and Anne Boleyn, his second wife, who was executed when Elizabeth was two years old. Anne\'s marriage to Henry was annulled, and Elizabeth was declared illegitimate. Henry restored her to the line of succession when she was 10, via the Third Succession Act 1543. After Henry\'s death in 1547, Elizabeth\'s younger half-brother Edward VI ruled until his own death in 1553, bequeathing the crown to a Protestant cousin, Lady Jane Grey, and ignoring the claims of his two half-sisters, the Catholic Mary and the younger Elizabeth, in spite of statutes to the contrary. Edward\'s will was set aside within weeks of his death and Mary became queen, deposing and executing Jane. During Mary\'s reign, Elizabeth was imprisoned for nearly a year on suspicion of supporting Protestant rebels.\nUpon her half-sister\'s death in 1558, Elizabeth succeeded to the throne and set out to rule by good counsel. She depended heavily on a group of trusted advisers led by William Cecil, whom she created Baron Burghley. One of her first actions as queen was the establishment of an English Protestant church, of which she became the supreme governor. This era, later named the Elizabethan Religious Settlement, would evolve into the Church of England. It was expected that Elizabeth would marry and produce an heir; however, despite numerous courtships, she never did, and because of this she is sometimes referred to as the "Virgin Queen". She was eventually succeeded by her first cousin twice removed, James VI of Scotland, the son of Mary, Queen of Scots.\nIn government, Elizabeth was more moderate than her father and siblings had been. One of her mottoes was video et taceo ("I see and keep silent"). In religion, she was relatively tolerant and avoided systematic persecution. After the pope declared her illegitimate in 1570, which in theory released English Catholics from allegiance to her, several conspiracies threatened her life, all of which were defeated with the help of her ministers\' secret service, run by Sir Francis Walsingham. Elizabeth was cautious in foreign affairs, manoeuvring between the major powers of France and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France, and Ireland. By the mid-1580s, England could no longer avoid war with Spain.\nAs she grew older, Elizabeth became celebrated for her virginity. A cult of personality grew around her which was celebrated in the portraits, pageants, and literature of the day. Elizabeth\'s reign became known as the Elizabethan era. The period is famous for the flourishing of English drama, led by playwrights such as William Shakespeare and Christopher Marlowe, the prowess of English maritime adventurers, such as Francis Drake and Walter Raleigh, and for the defeat of the Spanish Armada. Some historians depict Elizabeth as a short-tempered, sometimes indecisive ruler, who enjoyed more than her fair share of luck. Towards the end of her reign, a series of economic and military problems weakened her popularity. Elizabeth is acknowledged as a charismatic performer ("Gloriana") and a dogged survivor ("Good Queen Bess") in an era when government was ramshackle and limited, and when monarchs in neighbouring countries faced internal problems that jeopardised their thrones. After the short, disastrous reigns of her half-siblings, her 44 years on the throne provided welcome stability for the kingdom and helped to forge a sense of national identity.\n\n\n== Early life ==\n\nElizabeth was born at Greenwich Palace on 7 September 1533 and was named after her grandmothers, Elizabeth of York and Lady Elizabeth Howard. She was the second child of Henry VIII of England born in wedlock to survive infancy. Her mother was Henry\'s second wife, Anne Bol', metadata={'title': 'Elizabeth I', 'summary': 'Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and Anne Boleyn, his second wife, who was executed when Elizabeth was two years old. Anne\'s marriage to Henry was annulled, and Elizabeth was declared illegitimate. Henry restored her to the line of succession when she was 10, via the Third Succession Act 1543. After Henry\'s death in 1547, Elizabeth\'s younger half-brother Edward VI ruled until his own death in 1553, bequeathing the crown to a Protestant cousin, Lady Jane Grey, and ignoring the claims of his two half-sisters, the Catholic Mary and the younger Elizabeth, in spite of statutes to the contrary. Edward\'s will was set aside within weeks of his death and Mary became queen, deposing and executing Jane. During Mary\'s reign, Elizabeth was imprisoned for nearly a year on suspicion of supporting Protestant rebels.\nUpon her half-sister\'s death in 1558, Elizabeth succeeded to the throne and set out to rule by good counsel. She depended heavily on a group of trusted advisers led by William Cecil, whom she created Baron Burghley. One of her first actions as queen was the establishment of an English Protestant church, of which she became the supreme governor. This era, later named the Elizabethan Religious Settlement, would evolve into the Church of England. It was expected that Elizabeth would marry and produce an heir; however, despite numerous courtships, she never did, and because of this she is sometimes referred to as the "Virgin Queen". She was eventually succeeded by her first cousin twice removed, James VI of Scotland, the son of Mary, Queen of Scots.\nIn government, Elizabeth was more moderate than her father and siblings had been. One of her mottoes was video et taceo ("I see and keep silent"). In religion, she was relatively tolerant and avoided systematic persecution. After the pope declared her illegitimate in 1570, which in theory released English Catholics from allegiance to her, several conspiracies threatened her life, all of which were defeated with the help of her ministers\' secret service, run by Sir Francis Walsingham. Elizabeth was cautious in foreign affairs, manoeuvring between the major powers of France and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France, and Ireland. By the mid-1580s, England could no longer avoid war with Spain.\nAs she grew older, Elizabeth became celebrated for her virginity. A cult of personality grew around her which was celebrated in the portraits, pageants, and literature of the day. Elizabeth\'s reign became known as the Elizabethan era. The period is famous for the flourishing of English drama, led by playwrights such as William Shakespeare and Christopher Marlowe, the prowess of English maritime adventurers, such as Francis Drake and Walter Raleigh, and for the defeat of the Spanish Armada. Some historians depict Elizabeth as a short-tempered, sometimes indecisive ruler, who enjoyed more than her fair share of luck. Towards the end of her reign, a series of economic and military problems weakened her popularity. Elizabeth is acknowledged as a charismatic performer ("Gloriana") and a dogged survivor ("Good Queen Bess") in an era when government was ramshackle and limited, and when monarchs in neighbouring countries faced internal problems that jeopardised their thrones. After the short, disastrous reigns of her half-siblings, her 44 years on the throne provided welcome stability for the kingdom and helped to forge a sense of national identity.', 'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'}),
 Document(page_content='Elizabeth or Elizaveta Petrovna (Russian: Елизаве́та Петро́вна; 29 December [O.S. 18 December] 1709 – 5 January [O.S. 25 December] 1762) reigned as Empress of Russia from 1741 until her death in 1762. She remains one of the most popular Russian monarchs because of her decision not to execute a single person during her reign, her numerous construction projects, and her strong opposition to Prussian policies.\nThe second-eldest daughter of Tsar Peter the Great (r.\u20091682–1725), Elizabeth lived through the confused successions of her father\'s descendants following her half-brother Alexei\'s death in 1718. The throne first passed to her mother Catherine I of Russia (r.\u20091725–1727), then to her nephew Peter II, who died in 1730 and was succeeded by Elizabeth\'s first cousin Anna (r.\u20091730–1740). After the brief rule of Anna\'s infant great-nephew, Ivan VI, Elizabeth seized the throne with the military\'s support and declared her own nephew, the future Peter III, her heir.\nDuring her reign Elizabeth continued the policies of her father and brought about a remarkable Age of Enlightenment in Russia. Her domestic policies allowed the nobles to gain dominance in local government while shortening their terms of service to the state. She encouraged Mikhail Lomonosov\'s foundation of the University of Moscow, the highest-ranking Russian educational institution. Her court became one of the most splendid in all Europe, especially regarding architecture: she modernised Russia\'s roads, encouraged Ivan Shuvalov\'s foundation of the Imperial Academy of Arts, and financed grandiose Baroque projects of her favourite architect, Bartolomeo Rastrelli, particularly in Peterhof Palace. The Winter Palace and the Smolny Cathedral in Saint Petersburg are among the chief monuments of her reign.\nElizabeth led the Russian Empire during the two major European conflicts of her time: the War of Austrian Succession (1740–1748) and the Seven Years\' War (1756–1763). She and diplomat Aleksey Bestuzhev-Ryumin solved the first event by forming an alliance with Austria and France, but indirectly caused the second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender in January 1762, the Russian Empress died. She was the last agnatic member of the House of Romanov to reign over the Russian Empire.\n\n\n== Early life ==\n\n\n=== Childhood and teenage years ===\n\nElizabeth was born at Kolomenskoye, near Moscow, Russia, on 18 December 1709 (O.S.). Her parents were Peter the Great, Tsar of Russia and Catherine. Catherine was the daughter of Samuel Skowroński, a subject of Grand Duchy of Lithuania. Although no documentary record exists, her parents were said to have married secretly at the Cathedral of the Holy Trinity in Saint Petersburg at some point between 23 October and 1 December 1707. Their official marriage was at Saint Isaac\'s Cathedral in Saint Petersburg on 9 February 1712. On this day, the two children previously born to the couple (Anna and Elizabeth) were legitimised by their father and given the title of Tsarevna ("princess") on 6 March 1711. Of the twelve children born to Peter and Catherine (five sons and seven daughters), only the sisters survived to adulthood. They had one older surviving sibling, crown prince Alexei Petrovich, who was Peter\'s son by his first wife, noblewoman Eudoxia Lopukhina.\nAs a child, Elizabeth was the favourite of her father, whom she resembled both physically and temperamentally. Even though he adored his daughter, Peter did not devote time or attention to her education; having both a son and grandson from his first marriage to a noblewoman, he did not anticipate that a daughter born to his former maid might one day inherit the Russian throne, which had until that point never been occupied by a woman; as such, it was left to Catherine to raise the girls, a task met with considerable difficulty due to her own lack of education. Despite this, Elizabeth was', metadata={'title': 'Elizabeth of Russia', 'summary': "Elizabeth or Elizaveta Petrovna (Russian: Елизаве́та Петро́вна; 29 December [O.S. 18 December] 1709 – 5 January [O.S. 25 December] 1762) reigned as Empress of Russia from 1741 until her death in 1762. She remains one of the most popular Russian monarchs because of her decision not to execute a single person during her reign, her numerous construction projects, and her strong opposition to Prussian policies.\nThe second-eldest daughter of Tsar Peter the Great (r.\u20091682–1725), Elizabeth lived through the confused successions of her father's descendants following her half-brother Alexei's death in 1718. The throne first passed to her mother Catherine I of Russia (r.\u20091725–1727), then to her nephew Peter II, who died in 1730 and was succeeded by Elizabeth's first cousin Anna (r.\u20091730–1740). After the brief rule of Anna's infant great-nephew, Ivan VI, Elizabeth seized the throne with the military's support and declared her own nephew, the future Peter III, her heir.\nDuring her reign Elizabeth continued the policies of her father and brought about a remarkable Age of Enlightenment in Russia. Her domestic policies allowed the nobles to gain dominance in local government while shortening their terms of service to the state. She encouraged Mikhail Lomonosov's foundation of the University of Moscow, the highest-ranking Russian educational institution. Her court became one of the most splendid in all Europe, especially regarding architecture: she modernised Russia's roads, encouraged Ivan Shuvalov's foundation of the Imperial Academy of Arts, and financed grandiose Baroque projects of her favourite architect, Bartolomeo Rastrelli, particularly in Peterhof Palace. The Winter Palace and the Smolny Cathedral in Saint Petersburg are among the chief monuments of her reign.\nElizabeth led the Russian Empire during the two major European conflicts of her time: the War of Austrian Succession (1740–1748) and the Seven Years' War (1756–1763). She and diplomat Aleksey Bestuzhev-Ryumin solved the first event by forming an alliance with Austria and France, but indirectly caused the second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender in January 1762, the Russian Empress died. She was the last agnatic member of the House of Romanov to reign over the Russian Empire.", 'source': 'https://en.wikipedia.org/wiki/Elizabeth_of_Russia'}),
 Document(page_content='The succession to the childless Elizabeth I was an open question from her accession in 1558 to her death in 1603, when the crown passed to James VI of Scotland. While the accession of James went smoothly, the succession had been the subject of much debate for decades. In some scholarly views, it was a major political factor of the entire reign, even if not so voiced. Separate aspects have acquired their own nomenclature: the "Norfolk conspiracy", Patrick Collinson\'s "Elizabethan exclusion crisis", and the "Secret Correspondence".\nThe topics of debate remained obscured by uncertainty.\nElizabeth I avoided establishing the order of succession in any form, presumably because she feared for her own life once a successor was named.  She was also concerned with England forming a productive relationship with Scotland, whose Catholic and Presbyterian strongholds were resistant to female leadership. Catholic women who would be submissive to the Pope and not to English constitutional law were rejected.\nHenry VIII\'s will had named one male and seven females living at his death in 1547 as the line of succession: (1) his son Edward VI, (2) Mary I, (3) Elizabeth I, (4) Jane Grey, (5) Katherine Grey, (6) Mary Grey, and (7) Margaret Clifford. Elizabeth had outlived all of them.\nA number of authorities considered that the legal position hinged on documents such as the statute De natis ultra mare of Edward III, and the will of Henry VIII. There were different opinions about the application of these documents. Political, religious and military matters came to predominate later in Elizabeth\'s reign, in the context of the Anglo-Spanish War.\n\n\n== Cognatic descent from Henry VII ==\nDescent from the two daughters of Henry VII who reached adulthood, Margaret and Mary, was the first and main issue in the succession. \n\n\n=== Lennox claim ===\nMary I of England had died without managing to have her preferred successor and first cousin, Margaret Douglas, Countess of Lennox, nominated by parliament. Margaret Douglas was a daughter of Margaret Tudor, and lived to 1578, but became a marginal figure in discussions of the succession to Elizabeth I, who at no point clarified the dynastic issues of the Tudor line. When in 1565 Margaret Douglas\'s elder son Henry Stuart, Lord Darnley, married Mary, Queen of Scots, the "Lennox claim" was generally regarded as consolidated into the "Stuart claim".\n\n\n=== Stuart claimants ===\nJames VI was the son of two grandchildren of Margaret Tudor. Arbella Stuart, the most serious other contender by the late 16th century, was the daughter of Margaret Douglas, Countess of Lennox\'s younger son Charles Stuart, 1st Earl of Lennox.\nJames VI\'s mother, Mary, Queen of Scots, was considered a plausible successor to the English throne. At the beginning of Elizabeth\'s reign she sent ambassadors to England when a parliament was summoned, anticipating a role for parliament in settling the succession in her favour. Mary was a Roman Catholic, and her proximity to the succession was a factor in plotting, making her position a political problem for the English government, eventually resolved by judicial means. She was executed in 1587. In that year Mary\'s son James reached the age of twenty-one, while Arbella was only twelve.\n\n\n=== Suffolk claimants ===\nWhile the Stuart line of James and Arbella would have had political support, by 1600 the descendants of Mary Tudor were theoretically relevant, and on legal grounds could not be discounted. Frances Grey, Duchess of Suffolk, and Eleanor Clifford, Countess of Cumberland, both had children who were in the line of succession. Frances and Eleanor were Mary Tudor\'s daughters by her second husband, Charles Brandon, 1st Duke of Suffolk. Frances married Henry Grey, 1st Duke of Suffolk, and they had three daughters, Lady Jane Grey (1537–1554), Lady Catherine Grey (1540–1568), and Lady Mary Grey (1545–1578). Of these, the two youngest lived into Queen Elizabeth\'s reign.\nCatherine\'s first marriage to the youthful', metadata={'title': 'Succession to Elizabeth I', 'summary': 'The succession to the childless Elizabeth I was an open question from her accession in 1558 to her death in 1603, when the crown passed to James VI of Scotland. While the accession of James went smoothly, the succession had been the subject of much debate for decades. In some scholarly views, it was a major political factor of the entire reign, even if not so voiced. Separate aspects have acquired their own nomenclature: the "Norfolk conspiracy", Patrick Collinson\'s "Elizabethan exclusion crisis", and the "Secret Correspondence".\nThe topics of debate remained obscured by uncertainty.\nElizabeth I avoided establishing the order of succession in any form, presumably because she feared for her own life once a successor was named.  She was also concerned with England forming a productive relationship with Scotland, whose Catholic and Presbyterian strongholds were resistant to female leadership. Catholic women who would be submissive to the Pope and not to English constitutional law were rejected.\nHenry VIII\'s will had named one male and seven females living at his death in 1547 as the line of succession: (1) his son Edward VI, (2) Mary I, (3) Elizabeth I, (4) Jane Grey, (5) Katherine Grey, (6) Mary Grey, and (7) Margaret Clifford. Elizabeth had outlived all of them.\nA number of authorities considered that the legal position hinged on documents such as the statute De natis ultra mare of Edward III, and the will of Henry VIII. There were different opinions about the application of these documents. Political, religious and military matters came to predominate later in Elizabeth\'s reign, in the context of the Anglo-Spanish War.', 'source': 'https://en.wikipedia.org/wiki/Succession_to_Elizabeth_I'})]
```

```python
from langchain.text_splitter import TokenTextSplitter
text_splitter = TokenTextSplitter(chunk_size=512, chunk_overlap=24)
documents = text_splitter.split_documents(raw_documents[:3])
```

```python
from langchain_openai import ChatOpenAI
llm=ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo-0125")
```

```python
from langchain_experimental.graph_transformers import LLMGraphTransformer
llm_transformer = LLMGraphTransformer(llm=llm)
```

```python
graph_documents = llm_transformer.convert_to_graph_documents(documents)
```

```python
graph_documents
```

```result
[GraphDocument(nodes=[Node(id='Elizabeth I', type='Person'), Node(id='England', type='Country'), Node(id='Ireland', type='Country'), Node(id='House Of Tudor', type='Royal family'), Node(id='Henry Viii', type='Person'), Node(id='Anne Boleyn', type='Person'), Node(id='Edward Vi', type='Person'), Node(id='Lady Jane Grey', type='Person'), Node(id='Mary', type='Person'), Node(id='William Cecil', type='Person'), Node(id='Baron Burghley', type='Title'), Node(id='James Vi Of Scotland', type='Person'), Node(id='Mary, Queen Of Scots', type='Person'), Node(id='France', type='Country'), Node(id='Spain', type='Country'), Node(id='Sir Francis Walsingham', type='Person')], relationships=[Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='England', type='Country'), type='RULED'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Ireland', type='Country'), type='RULED'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='House Of Tudor', type='Royal family'), type='BELONGS_TO'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Henry Viii', type='Person'), type='CHILD_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Anne Boleyn', type='Person'), type='CHILD_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Edward Vi', type='Person'), type='HALF-SISTER_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Lady Jane Grey', type='Person'), type='IGNORED_CLAIMS_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Mary', type='Person'), type='HALF-SISTER_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='William Cecil', type='Person'), type='DEPENDS_ON'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Baron Burghley', type='Title'), type='CREATED_TITLE'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='James Vi Of Scotland', type='Person'), type='SUCCEEDED_BY'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Mary, Queen Of Scots', type='Person'), type='MOTHER_OF'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='France', type='Country'), type='MANOEUVRING_BETWEEN'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Spain', type='Country'), type='MANOEUVRING_BETWEEN'), Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='Sir Francis Walsingham', type='Person'), type='DEPENDS_ON')], source=Document(page_content='Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and Anne Boleyn, his second wife, who was executed when Elizabeth was two years old. Anne\'s marriage to Henry was annulled, and Elizabeth was declared illegitimate. Henry restored her to the line of succession when she was 10, via the Third Succession Act 1543. After Henry\'s death in 1547, Elizabeth\'s younger half-brother Edward VI ruled until his own death in 1553, bequeathing the crown to a Protestant cousin, Lady Jane Grey, and ignoring the claims of his two half-sisters, the Catholic Mary and the younger Elizabeth, in spite of statutes to the contrary. Edward\'s will was set aside within weeks of his death and Mary became queen, deposing and executing Jane. During Mary\'s reign, Elizabeth was imprisoned for nearly a year on suspicion of supporting Protestant rebels.\nUpon her half-sister\'s death in 1558, Elizabeth succeeded to the throne and set out to rule by good counsel. She depended heavily on a group of trusted advisers led by William Cecil, whom she created Baron Burghley. One of her first actions as queen was the establishment of an English Protestant church, of which she became the supreme governor. This era, later named the Elizabethan Religious Settlement, would evolve into the Church of England. It was expected that Elizabeth would marry and produce an heir; however, despite numerous courtships, she never did, and because of this she is sometimes referred to as the "Virgin Queen". She was eventually succeeded by her first cousin twice removed, James VI of Scotland, the son of Mary, Queen of Scots.\nIn government, Elizabeth was more moderate than her father and siblings had been. One of her mottoes was video et taceo ("I see and keep silent"). In religion, she was relatively tolerant and avoided systematic persecution. After the pope declared her illegitimate in 1570, which in theory released English Catholics from allegiance to her, several conspiracies threatened her life, all of which were defeated with the help of her ministers\' secret service, run by Sir Francis Walsingham. Elizabeth was cautious in foreign affairs, manoeuvring between the major powers of France and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France,', metadata={'title': 'Elizabeth I', 'summary': 'Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and Anne Boleyn, his second wife, who was executed when Elizabeth was two years old. Anne\'s marriage to Henry was annulled, and Elizabeth was declared illegitimate. Henry restored her to the line of succession when she was 10, via the Third Succession Act 1543. After Henry\'s death in 1547, Elizabeth\'s younger half-brother Edward VI ruled until his own death in 1553, bequeathing the crown to a Protestant cousin, Lady Jane Grey, and ignoring the claims of his two half-sisters, the Catholic Mary and the younger Elizabeth, in spite of statutes to the contrary. Edward\'s will was set aside within weeks of his death and Mary became queen, deposing and executing Jane. During Mary\'s reign, Elizabeth was imprisoned for nearly a year on suspicion of supporting Protestant rebels.\nUpon her half-sister\'s death in 1558, Elizabeth succeeded to the throne and set out to rule by good counsel. She depended heavily on a group of trusted advisers led by William Cecil, whom she created Baron Burghley. One of her first actions as queen was the establishment of an English Protestant church, of which she became the supreme governor. This era, later named the Elizabethan Religious Settlement, would evolve into the Church of England. It was expected that Elizabeth would marry and produce an heir; however, despite numerous courtships, she never did, and because of this she is sometimes referred to as the "Virgin Queen". She was eventually succeeded by her first cousin twice removed, James VI of Scotland, the son of Mary, Queen of Scots.\nIn government, Elizabeth was more moderate than her father and siblings had been. One of her mottoes was video et taceo ("I see and keep silent"). In religion, she was relatively tolerant and avoided systematic persecution. After the pope declared her illegitimate in 1570, which in theory released English Catholics from allegiance to her, several conspiracies threatened her life, all of which were defeated with the help of her ministers\' secret service, run by Sir Francis Walsingham. Elizabeth was cautious in foreign affairs, manoeuvring between the major powers of France and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France, and Ireland. By the mid-1580s, England could no longer avoid war with Spain.\nAs she grew older, Elizabeth became celebrated for her virginity. A cult of personality grew around her which was celebrated in the portraits, pageants, and literature of the day. Elizabeth\'s reign became known as the Elizabethan era. The period is famous for the flourishing of English drama, led by playwrights such as William Shakespeare and Christopher Marlowe, the prowess of English maritime adventurers, such as Francis Drake and Walter Raleigh, and for the defeat of the Spanish Armada. Some historians depict Elizabeth as a short-tempered, sometimes indecisive ruler, who enjoyed more than her fair share of luck. Towards the end of her reign, a series of economic and military problems weakened her popularity. Elizabeth is acknowledged as a charismatic performer ("Gloriana") and a dogged survivor ("Good Queen Bess") in an era when government was ramshackle and limited, and when monarchs in neighbouring countries faced internal problems that jeopardised their thrones. After the short, disastrous reigns of her half-siblings, her 44 years on the throne provided welcome stability for the kingdom and helped to forge a sense of national identity.', 'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'})),
 GraphDocument(nodes=[Node(id='Elizabeth', type='Person'), Node(id='Spain', type='Country'), Node(id='Netherlands', type='Country'), Node(id='France', type='Country'), Node(id='Ireland', type='Country'), Node(id='William Shakespeare', type='Playwright'), Node(id='Christopher Marlowe', type='Playwright'), Node(id='Francis Drake', type='Maritime adventurer'), Node(id='Walter Raleigh', type='Maritime adventurer'), Node(id='Spanish Armada', type='Event')], relationships=[Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Spain', type='Country'), type='WAR'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Netherlands', type='Country'), type='WAR'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='France', type='Country'), type='WAR'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Ireland', type='Country'), type='WAR'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='William Shakespeare', type='Playwright'), type='INFLUENCED'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Christopher Marlowe', type='Playwright'), type='INFLUENCED'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Francis Drake', type='Maritime adventurer'), type='INFLUENCED'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Walter Raleigh', type='Maritime adventurer'), type='INFLUENCED'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Spanish Armada', type='Event'), type='DEFEATED')], source=Document(page_content=' and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France, and Ireland. By the mid-1580s, England could no longer avoid war with Spain.\nAs she grew older, Elizabeth became celebrated for her virginity. A cult of personality grew around her which was celebrated in the portraits, pageants, and literature of the day. Elizabeth\'s reign became known as the Elizabethan era. The period is famous for the flourishing of English drama, led by playwrights such as William Shakespeare and Christopher Marlowe, the prowess of English maritime adventurers, such as Francis Drake and Walter Raleigh, and for the defeat of the Spanish Armada. Some historians depict Elizabeth as a short-tempered, sometimes indecisive ruler, who enjoyed more than her fair share of luck. Towards the end of her reign, a series of economic and military problems weakened her popularity. Elizabeth is acknowledged as a charismatic performer ("Gloriana") and a dogged survivor ("Good Queen Bess") in an era when government was ramshackle and limited, and when monarchs in neighbouring countries faced internal problems that jeopardised their thrones. After the short, disastrous reigns of her half-siblings, her 44 years on the throne provided welcome stability for the kingdom and helped to forge a sense of national identity.\n\n\n== Early life ==\n\nElizabeth was born at Greenwich Palace on 7 September 1533 and was named after her grandmothers, Elizabeth of York and Lady Elizabeth Howard. She was the second child of Henry VIII of England born in wedlock to survive infancy. Her mother was Henry\'s second wife, Anne Bol', metadata={'title': 'Elizabeth I', 'summary': 'Elizabeth I (7 September 1533 – 24 March 1603) was Queen of England and Ireland from 17 November 1558 until her death in 1603. She was the last monarch of the House of Tudor.\nElizabeth was the only surviving child of Henry VIII and Anne Boleyn, his second wife, who was executed when Elizabeth was two years old. Anne\'s marriage to Henry was annulled, and Elizabeth was declared illegitimate. Henry restored her to the line of succession when she was 10, via the Third Succession Act 1543. After Henry\'s death in 1547, Elizabeth\'s younger half-brother Edward VI ruled until his own death in 1553, bequeathing the crown to a Protestant cousin, Lady Jane Grey, and ignoring the claims of his two half-sisters, the Catholic Mary and the younger Elizabeth, in spite of statutes to the contrary. Edward\'s will was set aside within weeks of his death and Mary became queen, deposing and executing Jane. During Mary\'s reign, Elizabeth was imprisoned for nearly a year on suspicion of supporting Protestant rebels.\nUpon her half-sister\'s death in 1558, Elizabeth succeeded to the throne and set out to rule by good counsel. She depended heavily on a group of trusted advisers led by William Cecil, whom she created Baron Burghley. One of her first actions as queen was the establishment of an English Protestant church, of which she became the supreme governor. This era, later named the Elizabethan Religious Settlement, would evolve into the Church of England. It was expected that Elizabeth would marry and produce an heir; however, despite numerous courtships, she never did, and because of this she is sometimes referred to as the "Virgin Queen". She was eventually succeeded by her first cousin twice removed, James VI of Scotland, the son of Mary, Queen of Scots.\nIn government, Elizabeth was more moderate than her father and siblings had been. One of her mottoes was video et taceo ("I see and keep silent"). In religion, she was relatively tolerant and avoided systematic persecution. After the pope declared her illegitimate in 1570, which in theory released English Catholics from allegiance to her, several conspiracies threatened her life, all of which were defeated with the help of her ministers\' secret service, run by Sir Francis Walsingham. Elizabeth was cautious in foreign affairs, manoeuvring between the major powers of France and Spain. She half-heartedly supported a number of ineffective, poorly resourced military campaigns in the Netherlands, France, and Ireland. By the mid-1580s, England could no longer avoid war with Spain.\nAs she grew older, Elizabeth became celebrated for her virginity. A cult of personality grew around her which was celebrated in the portraits, pageants, and literature of the day. Elizabeth\'s reign became known as the Elizabethan era. The period is famous for the flourishing of English drama, led by playwrights such as William Shakespeare and Christopher Marlowe, the prowess of English maritime adventurers, such as Francis Drake and Walter Raleigh, and for the defeat of the Spanish Armada. Some historians depict Elizabeth as a short-tempered, sometimes indecisive ruler, who enjoyed more than her fair share of luck. Towards the end of her reign, a series of economic and military problems weakened her popularity. Elizabeth is acknowledged as a charismatic performer ("Gloriana") and a dogged survivor ("Good Queen Bess") in an era when government was ramshackle and limited, and when monarchs in neighbouring countries faced internal problems that jeopardised their thrones. After the short, disastrous reigns of her half-siblings, her 44 years on the throne provided welcome stability for the kingdom and helped to forge a sense of national identity.', 'source': 'https://en.wikipedia.org/wiki/Elizabeth_I'})),
 GraphDocument(nodes=[Node(id='Elizabeth Petrovna', type='Person'), Node(id='Empress Of Russia', type='Title'), Node(id='Tsar Peter The Great', type='Person'), Node(id='Catherine I Of Russia', type='Person'), Node(id='Peter Ii', type='Person'), Node(id='Anna', type='Person'), Node(id='Ivan Vi', type='Person'), Node(id='Peter Iii', type='Person'), Node(id='Mikhail Lomonosov', type='Person'), Node(id='Ivan Shuvalov', type='Person'), Node(id='Bartolomeo Rastrelli', type='Person'), Node(id='Aleksey Bestuzhev-Ryumin', type='Person'), Node(id='Frederick The Great', type='Person')], relationships=[Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Empress Of Russia', type='Title'), type='HELD_TITLE'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Tsar Peter The Great', type='Person'), type='DAUGHTER_OF'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Catherine I Of Russia', type='Person'), type='DAUGHTER_OF'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Peter Ii', type='Person'), type='RELATED_TO'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Anna', type='Person'), type='RELATED_TO'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Ivan Vi', type='Person'), type='RELATED_TO'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Peter Iii', type='Person'), type='DECLARED_AS_HEIR'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Mikhail Lomonosov', type='Person'), type='SUPPORTED_FOUNDATION_OF_UNIVERSITY_OF_MOSCOW'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Ivan Shuvalov', type='Person'), type='ENCOURAGED_FOUNDATION_OF_IMPERIAL_ACADEMY_OF_ARTS'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Bartolomeo Rastrelli', type='Person'), type='SUPPORTED_ARCHITECTURAL_PROJECTS_BY'), Relationship(source=Node(id='Elizabeth Petrovna', type='Person'), target=Node(id='Aleksey Bestuzhev-Ryumin', type='Person'), type='SOLVED_EUROPEAN_CONFLICT_WITH')], source=Document(page_content="Elizabeth or Elizaveta Petrovna (Russian: Елизаве́та Петро́вна; 29 December [O.S. 18 December] 1709 – 5 January [O.S. 25 December] 1762) reigned as Empress of Russia from 1741 until her death in 1762. She remains one of the most popular Russian monarchs because of her decision not to execute a single person during her reign, her numerous construction projects, and her strong opposition to Prussian policies.\nThe second-eldest daughter of Tsar Peter the Great (r.\u20091682–1725), Elizabeth lived through the confused successions of her father's descendants following her half-brother Alexei's death in 1718. The throne first passed to her mother Catherine I of Russia (r.\u20091725–1727), then to her nephew Peter II, who died in 1730 and was succeeded by Elizabeth's first cousin Anna (r.\u20091730–1740). After the brief rule of Anna's infant great-nephew, Ivan VI, Elizabeth seized the throne with the military's support and declared her own nephew, the future Peter III, her heir.\nDuring her reign Elizabeth continued the policies of her father and brought about a remarkable Age of Enlightenment in Russia. Her domestic policies allowed the nobles to gain dominance in local government while shortening their terms of service to the state. She encouraged Mikhail Lomonosov's foundation of the University of Moscow, the highest-ranking Russian educational institution. Her court became one of the most splendid in all Europe, especially regarding architecture: she modernised Russia's roads, encouraged Ivan Shuvalov's foundation of the Imperial Academy of Arts, and financed grandiose Baroque projects of her favourite architect, Bartolomeo Rastrelli, particularly in Peterhof Palace. The Winter Palace and the Smolny Cathedral in Saint Petersburg are among the chief monuments of her reign.\nElizabeth led the Russian Empire during the two major European conflicts of her time: the War of Austrian Succession (1740–1748) and the Seven Years' War (1756–1763). She and diplomat Aleksey Bestuzhev-Ryumin solved the first event by forming an alliance with Austria and France, but indirectly caused the second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender", metadata={'title': 'Elizabeth of Russia', 'summary': "Elizabeth or Elizaveta Petrovna (Russian: Елизаве́та Петро́вна; 29 December [O.S. 18 December] 1709 – 5 January [O.S. 25 December] 1762) reigned as Empress of Russia from 1741 until her death in 1762. She remains one of the most popular Russian monarchs because of her decision not to execute a single person during her reign, her numerous construction projects, and her strong opposition to Prussian policies.\nThe second-eldest daughter of Tsar Peter the Great (r.\u20091682–1725), Elizabeth lived through the confused successions of her father's descendants following her half-brother Alexei's death in 1718. The throne first passed to her mother Catherine I of Russia (r.\u20091725–1727), then to her nephew Peter II, who died in 1730 and was succeeded by Elizabeth's first cousin Anna (r.\u20091730–1740). After the brief rule of Anna's infant great-nephew, Ivan VI, Elizabeth seized the throne with the military's support and declared her own nephew, the future Peter III, her heir.\nDuring her reign Elizabeth continued the policies of her father and brought about a remarkable Age of Enlightenment in Russia. Her domestic policies allowed the nobles to gain dominance in local government while shortening their terms of service to the state. She encouraged Mikhail Lomonosov's foundation of the University of Moscow, the highest-ranking Russian educational institution. Her court became one of the most splendid in all Europe, especially regarding architecture: she modernised Russia's roads, encouraged Ivan Shuvalov's foundation of the Imperial Academy of Arts, and financed grandiose Baroque projects of her favourite architect, Bartolomeo Rastrelli, particularly in Peterhof Palace. The Winter Palace and the Smolny Cathedral in Saint Petersburg are among the chief monuments of her reign.\nElizabeth led the Russian Empire during the two major European conflicts of her time: the War of Austrian Succession (1740–1748) and the Seven Years' War (1756–1763). She and diplomat Aleksey Bestuzhev-Ryumin solved the first event by forming an alliance with Austria and France, but indirectly caused the second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender in January 1762, the Russian Empress died. She was the last agnatic member of the House of Romanov to reign over the Russian Empire.", 'source': 'https://en.wikipedia.org/wiki/Elizabeth_of_Russia'})),
 GraphDocument(nodes=[Node(id='Elizabeth', type='Person'), Node(id='Russian Empire', type='Country'), Node(id='Frederick The Great', type='Person'), Node(id='Russian Empress', type='Person'), Node(id='House Of Romanov', type='Family'), Node(id='Peter The Great', type='Person'), Node(id='Catherine', type='Person'), Node(id='Samuel Skowroński', type='Person'), Node(id='Grand Duchy Of Lithuania', type='Country'), Node(id='Anna', type='Person'), Node(id='Tsarevna', type='Title'), Node(id='Alexei Petrovich', type='Person'), Node(id='Eudoxia Lopukhina', type='Person')], relationships=[Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Peter The Great', type='Person'), type='PARENT'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Catherine', type='Person'), type='PARENT'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Catherine', type='Person'), type='SPOUSE'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Anna', type='Person'), type='PARENT'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Elizabeth', type='Person'), type='PARENT'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Alexei Petrovich', type='Person'), type='PARENT'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Eudoxia Lopukhina', type='Person'), type='SPOUSE'), Relationship(source=Node(id='Catherine', type='Person'), target=Node(id='Samuel Skowroński', type='Person'), type='PARENT'), Relationship(source=Node(id='Catherine', type='Person'), target=Node(id='Grand Duchy Of Lithuania', type='Country'), type='BIRTHPLACE'), Relationship(source=Node(id='Anna', type='Person'), target=Node(id='Peter The Great', type='Person'), type='PARENT'), Relationship(source=Node(id='Elizabeth', type='Person'), target=Node(id='Tsarevna', type='Title'), type='RECEIVED_TITLE'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Tsarevna', type='Title'), type='PARENT_GRANTED_TITLE'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Catherine', type='Person'), type='MARRIAGE'), Relationship(source=Node(id='Peter The Great', type='Person'), target=Node(id='Catherine', type='Person'), type='OFFICIAL_MARRIAGE')], source=Document(page_content=' second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender in January 1762, the Russian Empress died. She was the last agnatic member of the House of Romanov to reign over the Russian Empire.\n\n\n== Early life ==\n\n\n=== Childhood and teenage years ===\n\nElizabeth was born at Kolomenskoye, near Moscow, Russia, on 18 December 1709 (O.S.). Her parents were Peter the Great, Tsar of Russia and Catherine. Catherine was the daughter of Samuel Skowroński, a subject of Grand Duchy of Lithuania. Although no documentary record exists, her parents were said to have married secretly at the Cathedral of the Holy Trinity in Saint Petersburg at some point between 23 October and 1 December 1707. Their official marriage was at Saint Isaac\'s Cathedral in Saint Petersburg on 9 February 1712. On this day, the two children previously born to the couple (Anna and Elizabeth) were legitimised by their father and given the title of Tsarevna ("princess") on 6 March 1711. Of the twelve children born to Peter and Catherine (five sons and seven daughters), only the sisters survived to adulthood. They had one older surviving sibling, crown prince Alexei Petrovich, who was Peter\'s son by his first wife, noblewoman Eudoxia Lopukhina.\nAs a child, Elizabeth was the favourite of her father, whom she resembled both physically and temperamentally. Even though he adored his daughter, Peter did not devote time or attention to her education; having both a son and grandson from his first marriage to a noblewoman, he did not anticipate that a daughter born to his former maid might one day inherit the Russian throne, which had until that point never been occupied by a woman; as such, it was left to Catherine to raise the girls, a task met with considerable difficulty due to her own lack of education. Despite this, Elizabeth was', metadata={'title': 'Elizabeth of Russia', 'summary': "Elizabeth or Elizaveta Petrovna (Russian: Елизаве́та Петро́вна; 29 December [O.S. 18 December] 1709 – 5 January [O.S. 25 December] 1762) reigned as Empress of Russia from 1741 until her death in 1762. She remains one of the most popular Russian monarchs because of her decision not to execute a single person during her reign, her numerous construction projects, and her strong opposition to Prussian policies.\nThe second-eldest daughter of Tsar Peter the Great (r.\u20091682–1725), Elizabeth lived through the confused successions of her father's descendants following her half-brother Alexei's death in 1718. The throne first passed to her mother Catherine I of Russia (r.\u20091725–1727), then to her nephew Peter II, who died in 1730 and was succeeded by Elizabeth's first cousin Anna (r.\u20091730–1740). After the brief rule of Anna's infant great-nephew, Ivan VI, Elizabeth seized the throne with the military's support and declared her own nephew, the future Peter III, her heir.\nDuring her reign Elizabeth continued the policies of her father and brought about a remarkable Age of Enlightenment in Russia. Her domestic policies allowed the nobles to gain dominance in local government while shortening their terms of service to the state. She encouraged Mikhail Lomonosov's foundation of the University of Moscow, the highest-ranking Russian educational institution. Her court became one of the most splendid in all Europe, especially regarding architecture: she modernised Russia's roads, encouraged Ivan Shuvalov's foundation of the Imperial Academy of Arts, and financed grandiose Baroque projects of her favourite architect, Bartolomeo Rastrelli, particularly in Peterhof Palace. The Winter Palace and the Smolny Cathedral in Saint Petersburg are among the chief monuments of her reign.\nElizabeth led the Russian Empire during the two major European conflicts of her time: the War of Austrian Succession (1740–1748) and the Seven Years' War (1756–1763). She and diplomat Aleksey Bestuzhev-Ryumin solved the first event by forming an alliance with Austria and France, but indirectly caused the second. Russian troops enjoyed several victories against Prussia and briefly occupied Berlin, but when Frederick the Great was finally considering surrender in January 1762, the Russian Empress died. She was the last agnatic member of the House of Romanov to reign over the Russian Empire.", 'source': 'https://en.wikipedia.org/wiki/Elizabeth_of_Russia'})),
 GraphDocument(nodes=[Node(id='Elizabeth I', type='Person'), Node(id='James Vi Of Scotland', type='Person'), Node(id='Norfolk Conspiracy', type='Concept'), Node(id="Patrick Collinson'S Elizabethan Exclusion Crisis", type='Concept'), Node(id='Secret Correspondence', type='Concept'), Node(id='Henry Viii', type='Person'), Node(id='Edward Vi', type='Person'), Node(id='Mary I', type='Person'), Node(id='Jane Grey', type='Person'), Node(id='Katherine Grey', type='Person'), Node(id='Mary Grey', type='Person'), Node(id='Margaret Clifford', type='Person'), Node(id='Margaret Douglas', type='Person'), Node(id='Henry Stuart, Lord Darnley', type='Person'), Node(id='Mary, Queen Of Scots', type='Person')], relationships=[Relationship(source=Node(id='Elizabeth I', type='Person'), target=Node(id='James Vi Of Scotland', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Edward Vi', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Mary I', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Elizabeth I', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Jane Grey', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Katherine Grey', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Mary Grey', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Henry Viii', type='Person'), target=Node(id='Margaret Clifford', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Mary I', type='Person'), target=Node(id='Margaret Douglas', type='Person'), type='PREFERRED_SUCCESSOR'), Relationship(source=Node(id='Margaret Douglas', type='Person'), target=Node(id='Henry Stuart, Lord Darnley', type='Person'), type='FAMILY_RELATION'), Relationship(source=Node(id='Henry Stuart, Lord Darnley', type='Person'), target=Node(id='Mary, Queen Of Scots', type='Person'), type='MARRIAGE')], source=Document(page_content='The succession to the childless Elizabeth I was an open question from her accession in 1558 to her death in 1603, when the crown passed to James VI of Scotland. While the accession of James went smoothly, the succession had been the subject of much debate for decades. In some scholarly views, it was a major political factor of the entire reign, even if not so voiced. Separate aspects have acquired their own nomenclature: the "Norfolk conspiracy", Patrick Collinson\'s "Elizabethan exclusion crisis", and the "Secret Correspondence".\nThe topics of debate remained obscured by uncertainty.\nElizabeth I avoided establishing the order of succession in any form, presumably because she feared for her own life once a successor was named.  She was also concerned with England forming a productive relationship with Scotland, whose Catholic and Presbyterian strongholds were resistant to female leadership. Catholic women who would be submissive to the Pope and not to English constitutional law were rejected.\nHenry VIII\'s will had named one male and seven females living at his death in 1547 as the line of succession: (1) his son Edward VI, (2) Mary I, (3) Elizabeth I, (4) Jane Grey, (5) Katherine Grey, (6) Mary Grey, and (7) Margaret Clifford. Elizabeth had outlived all of them.\nA number of authorities considered that the legal position hinged on documents such as the statute De natis ultra mare of Edward III, and the will of Henry VIII. There were different opinions about the application of these documents. Political, religious and military matters came to predominate later in Elizabeth\'s reign, in the context of the Anglo-Spanish War.\n\n\n== Cognatic descent from Henry VII ==\nDescent from the two daughters of Henry VII who reached adulthood, Margaret and Mary, was the first and main issue in the succession. \n\n\n=== Lennox claim ===\nMary I of England had died without managing to have her preferred successor and first cousin, Margaret Douglas, Countess of Lennox, nominated by parliament. Margaret Douglas was a daughter of Margaret Tudor, and lived to 1578, but became a marginal figure in discussions of the succession to Elizabeth I, who at no point clarified the dynastic issues of the Tudor line. When in 1565 Margaret Douglas\'s elder son Henry Stuart, Lord Darnley, married Mary, Queen of Scots, the "Lennox claim" was generally regarded as consolidated into the "Stuart claim".', metadata={'title': 'Succession to Elizabeth I', 'summary': 'The succession to the childless Elizabeth I was an open question from her accession in 1558 to her death in 1603, when the crown passed to James VI of Scotland. While the accession of James went smoothly, the succession had been the subject of much debate for decades. In some scholarly views, it was a major political factor of the entire reign, even if not so voiced. Separate aspects have acquired their own nomenclature: the "Norfolk conspiracy", Patrick Collinson\'s "Elizabethan exclusion crisis", and the "Secret Correspondence".\nThe topics of debate remained obscured by uncertainty.\nElizabeth I avoided establishing the order of succession in any form, presumably because she feared for her own life once a successor was named.  She was also concerned with England forming a productive relationship with Scotland, whose Catholic and Presbyterian strongholds were resistant to female leadership. Catholic women who would be submissive to the Pope and not to English constitutional law were rejected.\nHenry VIII\'s will had named one male and seven females living at his death in 1547 as the line of succession: (1) his son Edward VI, (2) Mary I, (3) Elizabeth I, (4) Jane Grey, (5) Katherine Grey, (6) Mary Grey, and (7) Margaret Clifford. Elizabeth had outlived all of them.\nA number of authorities considered that the legal position hinged on documents such as the statute De natis ultra mare of Edward III, and the will of Henry VIII. There were different opinions about the application of these documents. Political, religious and military matters came to predominate later in Elizabeth\'s reign, in the context of the Anglo-Spanish War.', 'source': 'https://en.wikipedia.org/wiki/Succession_to_Elizabeth_I'})),
 GraphDocument(nodes=[Node(id='Margaret Tudor', type='Person'), Node(id='Arbella Stuart', type='Person'), Node(id='Margaret Douglas', type='Person'), Node(id='Charles Stuart', type='Person'), Node(id='James Vi', type='Person'), Node(id='Mary, Queen Of Scots', type='Person'), Node(id='Elizabeth', type='Person'), Node(id='Frances Grey', type='Person'), Node(id='Eleanor Clifford', type='Person'), Node(id='Charles Brandon', type='Person'), Node(id='Henry Grey', type='Person'), Node(id='Lady Jane Grey', type='Person'), Node(id='Lady Catherine Grey', type='Person'), Node(id='Lady Mary Grey', type='Person')], relationships=[Relationship(source=Node(id='Margaret Tudor', type='Person'), target=Node(id='James Vi', type='Person'), type='GRANDPARENT'), Relationship(source=Node(id='Margaret Tudor', type='Person'), target=Node(id='Arbella Stuart', type='Person'), type='GRANDPARENT'), Relationship(source=Node(id='Margaret Douglas', type='Person'), target=Node(id='Charles Stuart', type='Person'), type='PARENT'), Relationship(source=Node(id='Charles Stuart', type='Person'), target=Node(id='Arbella Stuart', type='Person'), type='PARENT'), Relationship(source=Node(id='Mary, Queen Of Scots', type='Person'), target=Node(id='James Vi', type='Person'), type='PARENT'), Relationship(source=Node(id='Mary, Queen Of Scots', type='Person'), target=Node(id='Arbella Stuart', type='Person'), type='PARENT'), Relationship(source=Node(id='Mary, Queen Of Scots', type='Person'), target=Node(id='Elizabeth', type='Person'), type='SUCCESSOR'), Relationship(source=Node(id='Frances Grey', type='Person'), target=Node(id='Lady Jane Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Frances Grey', type='Person'), target=Node(id='Lady Catherine Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Frances Grey', type='Person'), target=Node(id='Lady Mary Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Eleanor Clifford', type='Person'), target=Node(id='Lady Jane Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Eleanor Clifford', type='Person'), target=Node(id='Lady Catherine Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Eleanor Clifford', type='Person'), target=Node(id='Lady Mary Grey', type='Person'), type='PARENT'), Relationship(source=Node(id='Charles Brandon', type='Person'), target=Node(id='Frances Grey', type='Person'), type='SPOUSE'), Relationship(source=Node(id='Charles Brandon', type='Person'), target=Node(id='Eleanor Clifford', type='Person'), type='SPOUSE'), Relationship(source=Node(id='Henry Grey', type='Person'), target=Node(id='Frances Grey', type='Person'), type='SPOUSE')], source=Document(page_content=', Queen of Scots, the "Lennox claim" was generally regarded as consolidated into the "Stuart claim".\n\n\n=== Stuart claimants ===\nJames VI was the son of two grandchildren of Margaret Tudor. Arbella Stuart, the most serious other contender by the late 16th century, was the daughter of Margaret Douglas, Countess of Lennox\'s younger son Charles Stuart, 1st Earl of Lennox.\nJames VI\'s mother, Mary, Queen of Scots, was considered a plausible successor to the English throne. At the beginning of Elizabeth\'s reign she sent ambassadors to England when a parliament was summoned, anticipating a role for parliament in settling the succession in her favour. Mary was a Roman Catholic, and her proximity to the succession was a factor in plotting, making her position a political problem for the English government, eventually resolved by judicial means. She was executed in 1587. In that year Mary\'s son James reached the age of twenty-one, while Arbella was only twelve.\n\n\n=== Suffolk claimants ===\nWhile the Stuart line of James and Arbella would have had political support, by 1600 the descendants of Mary Tudor were theoretically relevant, and on legal grounds could not be discounted. Frances Grey, Duchess of Suffolk, and Eleanor Clifford, Countess of Cumberland, both had children who were in the line of succession. Frances and Eleanor were Mary Tudor\'s daughters by her second husband, Charles Brandon, 1st Duke of Suffolk. Frances married Henry Grey, 1st Duke of Suffolk, and they had three daughters, Lady Jane Grey (1537–1554), Lady Catherine Grey (1540–1568), and Lady Mary Grey (1545–1578). Of these, the two youngest lived into Queen Elizabeth\'s reign.\nCatherine\'s first marriage to the youthful', metadata={'title': 'Succession to Elizabeth I', 'summary': 'The succession to the childless Elizabeth I was an open question from her accession in 1558 to her death in 1603, when the crown passed to James VI of Scotland. While the accession of James went smoothly, the succession had been the subject of much debate for decades. In some scholarly views, it was a major political factor of the entire reign, even if not so voiced. Separate aspects have acquired their own nomenclature: the "Norfolk conspiracy", Patrick Collinson\'s "Elizabethan exclusion crisis", and the "Secret Correspondence".\nThe topics of debate remained obscured by uncertainty.\nElizabeth I avoided establishing the order of succession in any form, presumably because she feared for her own life once a successor was named.  She was also concerned with England forming a productive relationship with Scotland, whose Catholic and Presbyterian strongholds were resistant to female leadership. Catholic women who would be submissive to the Pope and not to English constitutional law were rejected.\nHenry VIII\'s will had named one male and seven females living at his death in 1547 as the line of succession: (1) his son Edward VI, (2) Mary I, (3) Elizabeth I, (4) Jane Grey, (5) Katherine Grey, (6) Mary Grey, and (7) Margaret Clifford. Elizabeth had outlived all of them.\nA number of authorities considered that the legal position hinged on documents such as the statute De natis ultra mare of Edward III, and the will of Henry VIII. There were different opinions about the application of these documents. Political, religious and military matters came to predominate later in Elizabeth\'s reign, in the context of the Anglo-Spanish War.', 'source': 'https://en.wikipedia.org/wiki/Succession_to_Elizabeth_I'}))]
```

```python
graph.add_graph_documents(
    graph_documents,
    baseEntityLabel=True,
    include_source=True
)
```

```python
# directly show the graph resulting from the given Cypher query
default_cypher = "MATCH (s)-[r:!MENTIONS]->(t) RETURN s,r,t LIMIT 50"
```

```python
from yfiles_jupyter_graphs import GraphWidget
from neo4j import GraphDatabase
```

```python
try:
  import google.colab
  from google.colab import output
  output.enable_custom_widget_manager()
except:
  pass
```

```python
def showGraph(cypher: str = default_cypher):
    # create a neo4j session to run queries
    driver = GraphDatabase.driver(
        uri = os.environ["NEO4J_URI"],
        auth = (os.environ["NEO4J_USERNAME"],
                os.environ["NEO4J_PASSWORD"]))
    session = driver.session()
    widget = GraphWidget(graph = session.run(cypher).graph())
    widget.node_label_mapping = 'id'
    display(widget)
    return widget
```

```python
showGraph()
```

```result
GraphWidget(layout=Layout(height='800px', width='100%'))
```

```result
GraphWidget(layout=Layout(height='800px', width='100%'))
```

```python
from typing import Tuple, List, Optional
```

```python
from langchain_community.vectorstores import Neo4jVector
```

```python
from langchain_openai import OpenAIEmbeddings
vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    search_type="hybrid",
    node_label="Document",
    text_node_properties=["text"],
    embedding_node_property="embedding"
)
```

```python
graph.query("CREATE FULLTEXT INDEX entity IF NOT EXISTS FOR (e:__Entity__) ON EACH [e.id]")
```

```result
[]
```

```python
from langchain_core.pydantic_v1 import BaseModel, Field
# Extract entities from text
class Entities(BaseModel):
    """Identifying information about entities."""

    names: List[str] = Field(
        ...,
        description="All the person, organization, or business entities that "
        "appear in the text",
    )
```

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
```

```python
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are extracting organization and person entities from the text.",
        ),
        (
            "human",
            "Use the given format to extract information from the following "
            "input: {question}",
        ),
    ]
)
```

```python
entity_chain = prompt | llm.with_structured_output(Entities)
```

```python
entity_chain.invoke({"question": "Where was Amelia Earhart born?"}).names
```

```result
['Amelia Earhart']
```

```python
from langchain_community.vectorstores.neo4j_vector import remove_lucene_chars
```

```python
def generate_full_text_query(input: str) -> str:
    full_text_query = ""
    words = [el for el in remove_lucene_chars(input).split() if el]
    for word in words[:-1]:
        full_text_query += f" {word}~2 AND"
    full_text_query += f" {words[-1]}~2"
    return full_text_query.strip()
```

```python
# Fulltext index query
def structured_retriever(question: str) -> str:
    result = ""
    entities = entity_chain.invoke({"question": question})
    for entity in entities.names:
        response = graph.query(
            """CALL db.index.fulltext.queryNodes('entity', $query, {limit:2})
            YIELD node,score
            CALL {
              WITH node
              MATCH (node)-[r:!MENTIONS]->(neighbor)
              RETURN node.id + ' - ' + type(r) + ' -> ' + neighbor.id AS output
              UNION ALL
              WITH node
              MATCH (node)<-[r:!MENTIONS]-(neighbor)
              RETURN neighbor.id + ' - ' + type(r) + ' -> ' +  node.id AS output
            }
            RETURN output LIMIT 50
            """,
            {"query": generate_full_text_query(entity)},
        )
        result += "\n".join([el['output'] for el in response])
    return result
```

```python
print(structured_retriever("Who is Elizabeth I?"))
```

```result
Elizabeth I - RULED -> England
Elizabeth I - RULED -> Ireland
Elizabeth I - BELONGS_TO -> House Of Tudor
Elizabeth I - CHILD_OF -> Henry Viii
Elizabeth I - CHILD_OF -> Anne Boleyn
Elizabeth I - HALF-SISTER_OF -> Edward Vi
Elizabeth I - HALF-SISTER_OF -> Mary
Elizabeth I - IGNORED_CLAIMS_OF -> Lady Jane Grey
Elizabeth I - DEPENDS_ON -> William Cecil
Elizabeth I - DEPENDS_ON -> Sir Francis Walsingham
Elizabeth I - CREATED_TITLE -> Baron Burghley
Elizabeth I - SUCCEEDED_BY -> James Vi Of Scotland
Elizabeth I - MOTHER_OF -> Mary, Queen Of Scots
Elizabeth I - MANOEUVRING_BETWEEN -> France
Elizabeth I - MANOEUVRING_BETWEEN -> Spain
Elizabeth I - SUCCESSOR -> James Vi Of Scotland
Henry Viii - SUCCESSOR -> Elizabeth I
```

```python
def retriever(question: str):
    print(f"Search query: {question}")
    structured_data = structured_retriever(question)
    unstructured_data = [el.page_content for el in vector_index.similarity_search(question)]
    final_data = f"""Structured data:
{structured_data}
Unstructured data:
{"#Document ". join(unstructured_data)}
    """
    return final_data
```

```python
_template = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question,
in its original language.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:"""
```

```python
CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(_template)
```

```python
def _format_chat_history(chat_history: List[Tuple[str, str]]) -> List:
    buffer = []
    for human, ai in chat_history:
        buffer.append(HumanMessage(content=human))
        buffer.append(AIMessage(content=ai))
    return buffer
```

```python
_search_query = RunnableBranch(
    # If input includes chat_history, we condense it with the follow-up question
    (
        RunnableLambda(lambda x: bool(x.get("chat_history"))).with_config(
            run_name="HasChatHistoryCheck"
        ),  # Condense follow-up question and chat into a standalone_question
        RunnablePassthrough.assign(
            chat_history=lambda x: _format_chat_history(x["chat_history"])
        )
        | CONDENSE_QUESTION_PROMPT
        | ChatOpenAI(temperature=0)
        | StrOutputParser(),
    ),
    # Else, we have no chat history, so just pass through the question
    RunnableLambda(lambda x : x["question"]),
)
```

```python
template = """Answer the question based only on the following context:
{context}

Question: {question}
Use natural language and be concise.
Answer:"""
```

```python
prompt = ChatPromptTemplate.from_template(template)
```

```python
chain = (
    RunnableParallel(
        {
            "context": _search_query | retriever,
            "question": RunnablePassthrough(),
        }
    )
    | prompt
    | llm
    | StrOutputParser()
)
```

```python
chain.invoke({"question": "Which house did Elizabeth I belong to?"})
```

```result
Search query: Which house did Elizabeth I belong to?
```

```result
'Elizabeth I belonged to the House of Tudor.'
```

```python
chain.invoke(
    {
        "question": "When was she born?",
        "chat_history": [("Which house did Elizabeth I belong to?", "House Of Tudor")],
    }
)
```

```result
Search query: When was Elizabeth I born?
```

```result
'Elizabeth I was born on 7 September 1533.'
```
