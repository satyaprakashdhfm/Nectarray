A code project, 23 files. Every file is below, and each name downloads the original.

```text title="Files"
agno_mcp_agent/__init__.py
agno_mcp_agent/__main__.py
agno_mcp_agent/agent_executor.py
agno_mcp_agent/agno_sessions/agno_agent_storage.db
agno_mcp_agent/mcp_agent.py
agno_sessions/agno_agent_storage.db
host_a2a_agent/__init__.py
host_a2a_agent/__main__.py
host_a2a_agent/Host_Agent.py
host_a2a_agent/remote_agent_connection.py
host_a2a_agent/ServerConfig.json
main.py
mcp/client.py
mcp/server.py
mcp_project/mcp_client.py
mcp_project/mcp_server.py
simple_a2a_client/__init__.py
simple_a2a_client/__main__.py
stream_client/stream_a2a_client.py
web_search_a2a_sever_agent/__init__.py
web_search_a2a_sever_agent/__main__.py
web_search_a2a_sever_agent/agent_executor.py
web_search_a2a_sever_agent/WebSearchAgent.py
```

## agno_mcp_agent/__init__.py

[agno_mcp_agent/__init__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_mcp_agent/__init__.py) · 0 B

_Empty file._

## agno_mcp_agent/__main__.py

[agno_mcp_agent/__main__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_mcp_agent/__main__.py) · 2.9 KB

```python title="agno_mcp_agent/__main__.py"
import sys, httpx, click, logging, uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
)
from a2a.server.tasks import (
    BasePushNotificationSender,
    InMemoryPushNotificationConfigStore,
    InMemoryTaskStore,
)
from .agent_executor import MCPAgentExecutor
from .mcp_agent import McpAgent
from dotenv import load_dotenv
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@click.command()
@click.option('--host', 'host', default='127.0.0.1')
@click.option('--port', 'port', default=8024)
def main(host, port):
    try:
        # Defining Agent Skills, capabilities and Agent Card --------------------------
        capabilities = AgentCapabilities(streaming=True, push_notifications=True)
        skill = AgentSkill(
            id='mcp_movie_stock_search',
            name='Movie and Stock Product Search',
            description='Search and retrieve information about movies and stock products using MCP tools',
            tags=['mcp', 'movies', 'products', 'search'],
            examples=['What comedy movies are available in 2025?', 'Show me stock product information'],
        )
        agent_card = AgentCard(
            name='MCP Agent',
            description='Helps with searching and retrieving information about movies and stock products using Model Context Protocol (MCP) tools',
            url=f'http://{host}:{port}/',
            version='1.0.0',
            default_input_modes=McpAgent.SUPPORTED_CONTENT_TYPES,
            default_output_modes=McpAgent.SUPPORTED_CONTENT_TYPES,
            capabilities=capabilities,
            skills=[skill],
        )
        httpx_client = httpx.AsyncClient(timeout=httpx.Timeout(60.0))
        push_config_store = InMemoryPushNotificationConfigStore()
        push_sender = BasePushNotificationSender(httpx_client=httpx_client,
                        config_store=push_config_store)
        
        # Creating the Request Handler---------------------------------------------
        request_handler = DefaultRequestHandler(
            agent_executor=MCPAgentExecutor(),
            task_store=InMemoryTaskStore(),
            push_config_store=push_config_store,
            push_sender= push_sender,
        )

        # Creating the A2A Starlette Application with the Agent Card and Request Handler
        server = A2AStarletteApplication(
            agent_card=agent_card,
            http_handler=request_handler,
        )
        # Running the Uvicorn Server ----------------------------------------------
        uvicorn.run(server.build(), host=host, port=port)
       
    except Exception as e:
        logger.error(f'An error occurred during server startup: {e}')
        sys.exit(1)
 
if __name__ == '__main__':
    main()
```

## agno_mcp_agent/agent_executor.py

[agno_mcp_agent/agent_executor.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_mcp_agent/agent_executor.py) · 3.8 KB

```python title="agno_mcp_agent/agent_executor.py"
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.utils import new_task
import logging
from a2a.types import (
    InternalError,
    InvalidRequestError,
    Part,
    TextPart,
    UnsupportedOperationError,
)
from a2a.utils.errors import ServerError
from .mcp_agent import McpAgent


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MCPAgentExecutor(AgentExecutor):
    """Websearch Remote Agent Implementation."""
    def __init__(self):
        self.agent = None
        self.mcp_tools = None
        
    async def _init_agent(self):
        if self.agent is None:
            self.mcp_tools = await McpAgent.get_mcp_tools()
            self.agent = McpAgent([self.mcp_tools], "./agno_mcp_agent/")
            
    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        await self._init_agent()
        # Checking if Context Exists ------------------------------------------
        if not context:
            raise ServerError(error=InvalidRequestError())
        
        # Getting the Message (query) sent from the A2A Client ----------------
        query = context.get_user_input()
        
        task = context.current_task
        print("="*20,"Context Information","="*30)
        print("Context Id:",context.context_id)
        print("query:",query)
        print("Task Id:",context.task_id)
        print("Context Task:",task)
        print("Context Message:",context.message)
        print("-"*70)
        # Creating a New Task if Task does not exists. And adding the same to the event queue.
        if not task:
            task = new_task(context.message)  # type: ignore
            await event_queue.enqueue_event(task)
        # Creating the Task Updater for the Current Task (Task Id) and Context (Context Id)---------
        # - Which adds the Task Updates (Status or concrete Artifacts - responses) to the Event Queue
        updater = TaskUpdater(event_queue, task.id, task.context_id)
        # Invoking the Agent with the received query -----------------------------
        try:
            # Inform that the task is in working state
            await updater.start_work()

            # Stream response from the agent and publish chunked artifacts
            first = True
            artifact_id = None
            async for chunk in self.agent.stream(query, task.context_id):
                # Each chunk is expected to be a dict with 'text' and 'is_last'
                text = chunk.get('text', '')
                last = bool(chunk.get('is_last', False))

                # Build a Part with the text chunk
                part = Part(root=TextPart(text=text))

                # For streaming, use append=True for intermediate chunks and last_chunk flag
                await updater.add_artifact(
                    parts=[part],
                    artifact_id=artifact_id,
                    name='websearch_result',
                    append=not first,
                    last_chunk=last,
                )
                first = False
                # After first add, subsequent adds should reuse same artifact id - TaskUpdater will generate id when None
                if last:
                    # mark completion
                    await updater.complete()
                    break

        except Exception as e:
            logger.error(f'An error occurred while getting the response: {e}')
            # publish failed state
            await updater.failed()
            raise ServerError(error=InternalError()) from e
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        raise ServerError(error=UnsupportedOperationError())
```

## agno_mcp_agent/agno_sessions/agno_agent_storage.db

[agno_mcp_agent/agno_sessions/agno_agent_storage.db](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_mcp_agent/agno_sessions/agno_agent_storage.db) · 48.0 KB

Binary file (a SQLite database) — download to open it.

## agno_mcp_agent/mcp_agent.py

[agno_mcp_agent/mcp_agent.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_mcp_agent/mcp_agent.py) · 3.0 KB

```python title="agno_mcp_agent/mcp_agent.py"
from dotenv import load_dotenv
from langchain_aws import ChatBedrockConverse
from pydantic import BaseModel, Field
from collections.abc import AsyncIterable
from typing import Annotated, Any, Literal, List
from typing_extensions import TypedDict
from rich.pretty import pprint
import asyncio, os
from uuid import uuid4
from agno.db.sqlite import SqliteDb
from agno.models.ollama import Ollama
from agno.agent import Agent, RunOutput
from agno.tools.mcp import MCPTools
from agno.models.aws import AwsBedrock
load_dotenv()

llm = AwsBedrock(
    id="amazon.nova-lite-v1:0", 
    aws_region="us-east-1", 
    temperature=0.9
)

class McpAgent:
    def __init__(self, tools, path: str = ''):
        self.model = llm
        self.tools = tools
        self.agent = self.get_agent(path)
    
    def handle_errors(self, e: ValueError) -> str:
        return "Invalid input provided"
    
    def get_agent(self, path: str = ''):
        instructions = """
                            You are a helpful assistant, which can answer queries on products in stock.
                            ## Instructions:
                            # - Always use the provided tools to answer questions.
                            # - provide well structured output, use lists, bullet point and tables as required.  
                        """
        agent = Agent(
            name = "Movie and Stock Product Information Agent", 
            description = "Perform search on Movie and Stock Product databases to retrieve related in", 
            model = self.model, 
            tools = self.tools, 
            markdown = True, 
            instructions = [instructions], 
            db = SqliteDb(
                session_table = "agent_sessions", 
                db_file = f"{path}agno_sessions/agno_agent_storage.db"
            ), 
            add_history_to_context = True, 
            read_chat_history = True, 
            num_history_runs = 3 
        )
        return agent
    
    async def invoke(self, query, context_id) -> dict[str, Any]:
        print(query)
        response: RunOutput = await self.agent.arun(query, session_id = context_id)
        message = response.messages[-1].content
        pprint(response)
        status = response.status
        print(message, status)

        return {
            "is_task_complete": True, 
            "content": message,
        }
    
    @staticmethod
    async def get_mcp_tools():
        mcp_tools = MCPTools(
            url="http://127.0.0.1:8007/mcpserver", 
            transport='streamable-http'
        )

        await mcp_tools.connect()
        return mcp_tools
    
    SUPPORTED_CONTENT_TYPES = ['text', 'text/plain']

async def main():
    mcp_tools = None
    try:
        mcp_tools = await McpAgent.get_mcp_tools()
        agent = McpAgent([mcp_tools], "./")
        response = await agent.invoke("comedy movies in 2025?", uuid4().hex)
        pprint(response)
    finally:
        if mcp_tools:
            await mcp_tools.close()
    
if __name__ == "__main__":
    asyncio.run(main())
```

## agno_sessions/agno_agent_storage.db

[agno_sessions/agno_agent_storage.db](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/agno_sessions/agno_agent_storage.db) · 40.0 KB

Binary file (a SQLite database) — download to open it.

## host_a2a_agent/__init__.py

[host_a2a_agent/__init__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/host_a2a_agent/__init__.py) · 0 B

_Empty file._

## host_a2a_agent/__main__.py

[host_a2a_agent/__main__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/host_a2a_agent/__main__.py) · 4.4 KB

````python title="host_a2a_agent/__main__.py"
import asyncio
# import gradio as gr  # Not needed for CLI version
from google.adk.events import Event
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from .Host_Agent import HostAgent
from collections.abc import AsyncIterator
from google.adk import Agent
from pprint import pformat
from uuid import uuid4
import traceback
from rich.pretty import pprint

APP_NAME = "simpleA2A_app"
USER_ID = "default_user"
SESSION_ID = uuid4().hex

def get_agent() -> Agent:
    async def get_host_agent() -> Agent:
        routing_agent_instance = await HostAgent.create()
        return routing_agent_instance.create_agent()
    try:
        return asyncio.run(get_host_agent())
    except RuntimeError as e:
        if 'asyncio.run() cannot be called from a running event loop' in str(e):
            print(
                f"Warning: {e}"
            )
    raise

SESSION_SERVICE = InMemorySessionService()
ROUTING_AGENT_RUNNER = Runner(
    agent = get_agent(), 
    app_name = APP_NAME, 
    session_service = SESSION_SERVICE
)

async def get_response_from_agent(
    message: str, 
    # history: list[gr.ChatMessage], 
) -> str:
# AsyncIterator[gr.ChatMessage]:
    try:
        event_iterator: AsyncIterator[Event] = ROUTING_AGENT_RUNNER.run_async(
            user_id = USER_ID, 
            session_id = SESSION_ID, 
            new_message = types.Content(
                role = "user", parts = [types.Part(text=message)]
            ), 
        )

        print("Events:", "-" * 30)
        async for event in event_iterator:
            if event.content and event.content.parts:
                print("Event Content: ", end = "")
                pprint(event.content)
                for part in event.content.parts:
                    if part.function_call:
                        formatted_call = f'```python\n{pformat(part.function_call.model_dump(exclude_none=True), indent=2, width=80)}\n```'
                        pprint(
                            {
                                "role": "assistant", 
                                "content": f" **Tool Call: {part.function_call.name}**\n{formatted_call}"
                            }
                        )
                    elif part.function_response:
                        response_content = part.function_response.response
                        if (isinstance(response_content, dict) and 'response' in response_content):
                            formatted_response_data = response_content['response']
                        else:
                            formatted_response_data = response_content
                        formatted_response = f'```json\n{pformat(formatted_response_data, indent=2, width=80)}\n```'
                        pprint(
                            {
                                "role": "assistant", 
                                "content": f'**Tool Response from {part.function_response.name}**\n{formatted_response}'
                            }
                        )
                
            if event.is_final_response():
                final_response_text = ''
                if event.content and event.content.parts:
                    final_response_text = ''.join([p.text for p in event.content.parts if p.text])
                elif event.actions and event.actions.escalate:
                    final_response_text = f'Agent escalated: {event.error_message or "No specific message."}'
                if final_response_text:
                    pprint({"role": 'assistant', 'content': final_response_text})
                    return final_response_text
                break

    except Exception as e:
        print(f'Error in get_response_from_agent (Type: {type(e)}): {e}')
        return 'an error occured while processing your request. Please check the server logs for details.'
    
async def main():
    print("Creating ADK session...")
    await SESSION_SERVICE.create_session(
        app_name = APP_NAME, user_id = USER_ID, session_id = SESSION_ID
    )
    print("ADK session created successfully.")

    while True:
        print("\n\n")
        print("Please enter your query (type 'exit' to quit):")
        user_input = input()

        if user_input.lower() == 'exit':
            print("Bye!=")
            break
        else:
            resp = await get_response_from_agent(user_input)
            print("AI:", resp)

if __name__ == '__main__':
    asyncio.run(main())
````

## host_a2a_agent/Host_Agent.py

[host_a2a_agent/Host_Agent.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/host_a2a_agent/Host_Agent.py) · 10.6 KB

```python title="host_a2a_agent/Host_Agent.py"
from rich.pretty import pprint
import asyncio, json, os, uuid, logging, httpx
from dotenv import load_dotenv
from a2a.client import A2ACardResolver
from a2a.types import (
    AgentCard, 
    Task, 
    MessageSendParams, 
    SendMessageRequest, 
    SendMessageResponse, 
    SendMessageSuccessResponse, 
)
from google.adk import Agent 
from google.adk.agents.callback_context import CallbackContext, ReadonlyContext
from google.adk.models.lite_llm import LiteLlm
from google.adk.tools.tool_context import ToolContext
from google.genai import types
from .remote_agent_connection import RemoteAgentConnections, TaskUpdateCallback

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def read_json_as_dict(filename : str)->dict : 
    """ reads a json file and returns its cnotent as python dictionary"""
    try:
        with open(filename,'r') as file :
            data_dict = json.load(file)
            return data_dict
    except FileNotFoundError:
        print("error the file was not found")
        return None
    except json.JSONDecodeError:
        print("error the file cant be decoded to dict")
        return None


def llm():
    """Initialize AWS Bedrock Nova Lite model via LiteLLM for the host agent."""
    bedrock_llm = LiteLlm(
        model="bedrock/amazon.nova-lite-v1:0",
        temperature=0.7,
        aws_region_name="us-east-1"
    )
    return bedrock_llm

class HostAgent:
    def __init__(
            self, 
            task_callback: TaskUpdateCallback | None = None,
    ):
        self.task_callback = task_callback
        self.remote_agent_connections: dict[str, RemoteAgentConnections] = {}
        self.cards: dict[str, AgentCard] = {}
        self.agents: str = ''
    
    async def _async_init_components(
            self, remote_agent_addresses: list[str]
    ) -> None:
        async with httpx.AsyncClient(timeout=300) as httpx_client:
            for address in remote_agent_addresses:
                card_resolver = A2ACardResolver(
                    httpx_client = httpx_client, 
                    base_url = address, 
                )
                try:
                    card = (
                        await card_resolver.get_agent_card()
                    )

                    remote_connection = RemoteAgentConnections(
                        agent_card = card, agent_url = address
                    )

                    self.remote_agent_connections[card.name] = remote_connection
                    self.cards[card.name] = card
                except httpx.ConnectError as e:
                    logger.debug(
                        'ERROR: Failed to get agent card from %s: %s', 
                        address, 
                        e
                    )
        for agent_name,card in self.cards.items():
            print(agent_name)
            pprint(card)
        agent_info = []
        for agent_detail_dict in self.list_remote_agents():
            agent_info.append(json.dumps(agent_detail_dict))
        self.agents = '\n'.join(agent_info)

    
    def list_remote_agents(self):
        if not self.remote_agent_connections:
            return []
        else:
            remote_agent_info = []
            for card in self.cards.values():
                logger.info(
                    "Found agent card: %s", card.model_dump(exclude_none=True)
                )
                logger.info("=" * 100)
                remote_agent_info.append(
                    {"name": card.name, 'description': card.description}
                )
            return remote_agent_info
    
    @classmethod
    async def create(
        cls,
        task_callback: TaskUpdateCallback | None = None, 
    ) -> 'HostAgent':
        instance = HostAgent(task_callback)
        
        LANGGRAPH_AGENT = os.getenv('LANGGRAPH_AGENT')
        remote_agent_addresses = [LANGGRAPH_AGENT]
        await instance._async_init_components(remote_agent_addresses)
        return instance

    def create_agent(self) -> Agent:
        return Agent(
            model = llm(), 
            name = "host_agent", 
            instruction = self.root_instruction, 
            before_model_callback = self.before_model_callback, 
            description = (
                "This agent orchestrates the decomposition of the user request into"
            ), 
            tools = [
                self.list_remote_agents, 
                self.send_message,
            ], 
        )
    
    def check_active_agent(self, context: ReadonlyContext):
        state = context.state
        if (
            "session_id" in state 
            and "session_active" in state 
            and state['session_active']
            and 'agent' in state
        ):
            return {"active_agent": f"{state['active_agent']}"}
        return {'active_agent': "None"}
    
    def before_model_callback(
            self, callback_context: CallbackContext, llm_request
    ):
        state = callback_context.state
        if 'session_active' not in state or not state['session_active']:
            if 'session_id' not in state:
                state['session_id'] = str(uuid.uuid4())
            state['session_active'] = True

    async def send_message(
            self, agent_name: str, message: str, tool_context: ToolContext
    ):
        """
    **Current Active agent:** {current_agent['active_agent']}

    Send msg doc string: 
    Sends a task either streaming (if supported) or non-streaming.

       This will send a message to the remote agent named agent_name.

       Args:
         agent_name: The name of the agent to send the task to.
         message: The message to send to the agent for the task.
         tool_context: The tool context this method runs in.

       Yields:
         A dictionary of JSON data.
    """
        if agent_name == "host_agent":
            raise ValueError("host_agent cannot send messages to itself")

        if agent_name not in self.remote_agent_connections:
            raise ValueError(f"Agent {agent_name} not found. {message}")
        
        if agent_name not in self.remote_agent_connections:
            raise ValueError(f"Agent {agent_name} not found. {message}")
        state = tool_context.state
        state['active_agent'] = agent_name
        client = self.remote_agent_connections[agent_name]

        if not client:
            raise ValueError(f"Client not available for {agent_name}")
        task_id = state.get('task_id', None)
        context_id = state.get('context_id', None)
        message_id = ''
        metadata = {}

        if 'input_message_metadata' in state:
            metadata.update(**state['input_message_metadata'])
            if 'message_id' in state['input_message_metadata']:
                message_id = state['input_message_metadata']['message_id']
        
        if not message_id:
            message_id = str(uuid.uuid4())
        
        payload = {
            'message': {
                'role': 'user', 
                'parts': [
                    {'kind': 'text', 'text': message}
                ], 
                'messageId': message_id
            }, 
        }

        if task_id:
            payload['message']['taskId'] = task_id
        
        if context_id:
            payload['message']['contextId'] = context_id
        
        message_request = SendMessageRequest(
            id = message_id, params = MessageSendParams.model_validate(payload)
        )

        send_response: SendMessageResponse = await client.send_message(
            message_request = message_request
        )

        logger.info(
            'send_response', 
            send_response.model_dump_json(exclude_none=True, indent=4)
        )

        if not isinstance(send_response.root, SendMessageSuccessResponse):
            logger.info("Received non_success response, aborting get task")
            return None
        
        if not isinstance(send_response.root.result, Task):
            logger.info("Received non-task response, aborting ")
            return None
        
        result = send_response.root.result

        if hasattr(result, 'artifacts') and result.artifacts:
            artifact = result.artifacts[0]
        elif hasattr(result, 'artifact') and result.artifact:
            artifact = result.artifact
        elif hasattr(result, 'content') and result.content:
            logger.info(f"Successfully retrieved response from A2A server")
            content = result.content
            return content
        else:
            logger.warning("No content")
            print("No response")
            return None
        
        if artifact:
            if hasattr(artifact, 'parts') and artifact.parts:
                part = artifact.parts[0]
                if hasattr(part, 'root') and hasattr(part.root, 'text'):
                    content = part.root.text
                    logger.info(f"Successfully retrived response from A2A server")
                    return content

        return None

    def root_instruction(self, context: ReadonlyContext) -> str:
       """Generate the root instruction for the HostAgent."""
       current_agent = self.check_active_agent(context)
       return f"""
    **Role:** You are an expert delegator that can delegate the user request to the appropriate specialized remote agents.
    Discovery:
    - You can use `list_remote_agents` to list the available remote agents you can use to delegate the task.

    **Task Delegation:**
    - For actionable requests, you can use `send_message` to interact with remote agents to take action, to assign actionable tasks to remote agents..

    Be sure to include the remote agent name when you respond to the user.
    Important:
    # **Tool Reliance:** If the user input is conversational (greetings, acknowledgements, clarifications),
    respond directly without using any tool.

    Use tools ONLY when delegation to a remote agent is required.
    # If you are not sure, please ask the user for more details.
    # **Prioritize Recent Interaction:** Focus on the most recent parts of the conversation primarily when processing requests.
    # **No Redundant Confirmations:** Do not ask remote agents for confirmation of information or actions.
    # **Focused Information Sharing:** Provide remote agents with only relevant contextual information. Avoid extraneous details.
    # **Transparent Communication:** Always present the complete and detailed response from the remote agent to the user.
    # **Autonomous Agent Engagement:** Never seek user permission before engaging with remote agents. If multiple agents are required to fulfill a request, connect with them directly without requesting user preference or confirmation.

    **Available Agents:**
    {self.agents}
    """
```

## host_a2a_agent/remote_agent_connection.py

[host_a2a_agent/remote_agent_connection.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/host_a2a_agent/remote_agent_connection.py) · 1.1 KB

```python title="host_a2a_agent/remote_agent_connection.py"
import logging, httpx
from collections.abc import Callable
from a2a.client import A2AClient
from a2a.types import (
    AgentCard, 
    SendMessageRequest, 
    SendMessageResponse, 
    Task, 
    TaskArtifactUpdateEvent, 
    TaskStatusUpdateEvent
)

TaskCallbackArg = Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent
TaskUpdateCallback = Callable[[TaskCallbackArg, AgentCard], Task]
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class RemoteAgentConnections:
    def __init__(self, agent_card: AgentCard, agent_url: str):
        logger.info(f'agent_card: {agent_card}')
        logger.info(f'agent_url: {agent_url}')
        self._httpx_client = httpx.AsyncClient(timeout=300)
        self.agent_client = A2AClient(
            self._httpx_client, agent_card, url=agent_url
        )
        self.card = agent_card
    
    def get_agent(self) -> AgentCard:
        return self.card
    
    async def send_message(
            self, message_request: SendMessageRequest
    ) -> SendMessageResponse:
        return await self.agent_client.send_message(message_request)
```

## host_a2a_agent/ServerConfig.json

[host_a2a_agent/ServerConfig.json](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/host_a2a_agent/ServerConfig.json) · 89 B

```json title="host_a2a_agent/ServerConfig.json"
{
    "webSearchServer":"http://127.0.0.1:8024",
    "agnomcpServer":"http://127.0.0.1"
}
```

## main.py

[main.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/main.py) · 281 B

```python title="main.py"
from numpy import array, dot
from numpy.linalg import norm

def cosine_similarity(vec_a, vec_b):
    return dot(vec_a, vec_b) / (norm(vec_a) * norm(vec_b))

new1 = array([1, 2, 3])
new2 = array([4, 5, 6])
result1 = cosine_similarity(new1, new2)
print("Cosine Similarity:", result1)
```

## mcp/client.py

[mcp/client.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/mcp/client.py) · 2.1 KB

```python title="mcp/client.py"
#!/usr/bin/env python3
"""Simple MCP Client - HTTP/SSE version"""

import asyncio
from mcp import ClientSession
from mcp.client.sse import sse_client


async def main():
    """Main client function"""
    print("=" * 60)
    print("🔌 Client: Connecting to MCP server at http://localhost:8000")
    print("=" * 60)
    
    async with sse_client(url="http://localhost:8000/sse") as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()
            
            print("✅ Client: Connected to MCP server!")
            print("-" * 60)
            
            # List available tools
            print("📋 Client: Requesting list of tools...")
            tools = await session.list_tools()
            print(f"\n✨ Available tools: {len(tools.tools)}")
            for tool in tools.tools:
                print(f"  - {tool.name}: {tool.description}")
            
            print("\n" + "-" * 60)
            print("🔧 Client: Calling tool: add_numbers with a=5, b=3")
            print("-" * 60)
            
            # Call the add_numbers tool
            result = await session.call_tool("add_numbers", arguments={"a": 5, "b": 3})
            
            print(f"\n📤 Result received:")
            for content in result.content:
                if hasattr(content, 'text'):
                    print(f"  ✅ {content.text}")
            
            print("\n" + "-" * 60)
            print("🔧 Client: Calling tool: add_numbers with a=10.5, b=20.3")
            print("-" * 60)
            
            # Call with different numbers
            result = await session.call_tool("add_numbers", arguments={"a": 10.5, "b": 20.3})
            
            print(f"\n📤 Result received:")
            for content in result.content:
                if hasattr(content, 'text'):
                    print(f"  ✅ {content.text}")
            
            print("\n" + "=" * 60)
            print("🎉 Client: Execution completed successfully!")
            print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
```

## mcp/server.py

[mcp/server.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/mcp/server.py) · 2.9 KB

```python title="mcp/server.py"
#!/usr/bin/env python3
"""Simple MCP Server with one tool - HTTP/SSE version"""

import asyncio
from typing import Any
from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent
from starlette.applications import Starlette
from starlette.routing import Route
import uvicorn


# Create server instance
app = Server("simple-mcp-server")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools"""
    print("📋 Server: Listing available tools...")
    return [
        Tool(
            name="add_numbers",
            description="Add two numbers together",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "First number"
                    },
                    "b": {
                        "type": "number",
                        "description": "Second number"
                    }
                },
                "required": ["a", "b"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Handle tool calls"""
    print(f"🔧 Server: Tool called - {name}")
    print(f"   Arguments: {arguments}")
    
    if name == "add_numbers":
        a = arguments.get("a")
        b = arguments.get("b")
        result = a + b
        print(f"   ✅ Result: {result}")
        return [
            TextContent(
                type="text",
                text=f"The sum of {a} and {b} is {result}"
            )
        ]
    else:
        raise ValueError(f"Unknown tool: {name}")


# Create SSE transport
sse = SseServerTransport("/messages")


async def handle_sse(request):
    """Handle SSE connections"""
    print("🔌 Server: New client connected!")
    async with sse.connect_sse(
        request.scope,
        request.receive,
        request._send,
    ) as streams:
        print("✅ Server: Client connection established")
        await app.run(
            streams[0],
            streams[1],
            app.create_initialization_options(),
        )
    print("👋 Server: Client disconnected")


async def handle_messages(request):
    """Handle POST messages"""
    print("📨 Server: Received message from client")
    return await sse.handle_post_message(request.scope, request.receive, request._send)


# Create Starlette app
starlette_app = Starlette(
    debug=True,
    routes=[
        Route("/sse", endpoint=handle_sse),
        Route("/messages", endpoint=handle_messages, methods=["POST"]),
    ],
)


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting MCP Server on http://localhost:8000")
    print("=" * 60)
    print("📡 SSE endpoint: http://localhost:8000/sse")
    print("📬 Messages endpoint: http://localhost:8000/messages")
    print("=" * 60)
    uvicorn.run(starlette_app, host="0.0.0.0", port=8000)
```

## mcp_project/mcp_client.py

[mcp_project/mcp_client.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/mcp_project/mcp_client.py) · 4.1 KB

```python title="mcp_project/mcp_client.py"
import asyncio
import os
from tabulate import tabulate
from pprint import pprint
import json
from pydantic import AnyUrl
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from mcp.client.streamable_http import streamablehttp_client
from mcp.shared.context import RequestContext
from mcp.shared.metadata_utils import get_display_name

# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="uv",  # Using uv to run the server
    args=["run", "python", "mcp_server.py"],
    env={"UV_INDEX": os.environ.get("UV_INDEX", "")},
)

## ------- Tool, Resource and Prompts usage and Sampling Callback defining Code goes here -----------

async def display_tools(session: ClientSession):
    """Display available tools with human-readable names"""
    tools_response = await session.list_tools()
    for tool in tools_response.tools:
        # get_display_name() returns the title if available, otherwise the name
        display_name = get_display_name(tool)
        print(f"Tool: {display_name}")
        if tool.description:
            print(f"   {tool.description}")

async def display_resources(session: ClientSession):
    """Display available resources with human-readable names"""
    resources_response = await session.list_resources()
    for resource in resources_response.resources:
        display_name = get_display_name(resource)
        print(f"Resource: {display_name} ({resource.uri})")
    templates_response = await session.list_resource_templates()
    for template in templates_response.resourceTemplates:
        display_name = get_display_name(template)
        print(f"Resource Template: {display_name}")

async def display_prompts(session: ClientSession):
    """Display available prompts with human-readable names"""
    prompts_response = await session.list_prompts()
    for prompt in prompts_response.prompts:
        display_name = get_display_name(prompt)
        print(f"Prompt: {display_name}")
        if prompt.description:
            print(f"   {prompt.description}")

## ------- Implementation Code -----------

async def run_stdio():
    """Run the MCP client with STDIO transport"""
    # Connecting to STDIO server
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()
            
            print("\n=== MCP Server Capabilities ===\n")
            
            # Display available tools
            print("--- Tools ---")
            await display_tools(session)
            
            # Display available resources
            print("\n--- Resources ---")
            await display_resources(session)
            
            # Display available prompts
            print("\n--- Prompts ---")
            await display_prompts(session)

async def run_http():
    """Run the MCP client with Streamable-HTTP transport"""
    # Connecting to Streamable-HTTP server
    async with streamablehttp_client("http://127.0.0.1:8007/mcpserver") as (
        read,
        write,
        _,
    ):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()
            
            print("\n=== MCP Server Capabilities ===\n")
            
            # Display available tools
            print("--- Tools ---")
            await display_tools(session)
            
            # Display available resources
            print("\n--- Resources ---")
            await display_resources(session)
            
            # Display available prompts
            print("\n--- Prompts ---")
            await display_prompts(session)

async def run():
    """Main run function - choose transport type"""
    # Change this to switch between STDIO and HTTP transports
    transport_type = os.environ.get("MCP_TRANSPORT", "stdio")  # "stdio" or "http"
    
    if transport_type == "http":
        await run_http()
    else:
        await run_stdio()

def main():
    """Entry point for the client script."""
    asyncio.run(run())

if __name__ == "__main__":
    main()
```

## mcp_project/mcp_server.py

[mcp_project/mcp_server.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/mcp_project/mcp_server.py) · 16.0 KB

```python title="mcp_project/mcp_server.py"
import json
import pandas as pd
import numpy as np
from mcp.server.fastmcp import FastMCP, Context as mcpContext
from pathlib import Path
from mcp.server.fastmcp.resources import TextResource, FileResource, BinaryResource, DirectoryResource
import aiofiles
import asyncio 
from mcp.types import PromptMessage, TextContent
from mcp.server.session import ServerSession
from fastmcp.prompts.prompt import Message
from pydantic import Field
from mcp.types import ModelPreferences
from fastmcp import Context
import pandas as pd
from typing import Annotated
from typing import TypedDict

#---- For STDIO Transport-------
#mcp = FastMCP(name="MCPServer")

#---- For Streamable HTTP Transport-------
mcp = FastMCP(name="MCPServer",  
              port=8007, 
              stateless_http=False, 
              streamable_http_path="/mcpserver", 
              host="127.0.0.1",
              warn_on_duplicate_resources=True)

##  ------- Resource, Tools and prompt Definitions goes here -----------

# RESOURCES=======================================================================================
# 1. Basic Direct / Static resource returning a predefined text
@mcp.resource(uri="resource://greeting",
              name="get_greeting",
              title="Get Greeting message",
              description="Get Simple Greeting message",
              mime_type="text/plain")
async def get_greeting() -> str:
    """Provides a simple greeting message."""
    return "Hello from FastMCP Resources!"

# 2. Exposing simple, predefined text using TextResource Class
notice_resource = TextResource(
    uri="resource://notice",
    title="Application Notice",
    name="Important Notice",
    text='''System maintenance scheduled for Sunday 10th August, 2025, from 10:00 Hrs to 17:00 hrs." \
    During this period, the application will be unavailable. We apologize for any inconvenience this may cause and appreciate your patience as we work to improve our services.'''
)
mcp.add_resource(notice_resource)

# 3. Exposing a static file directly as Resource
log_file_path = Path("app/logs/application.log")
@mcp.resource(uri=f"file://{log_file_path.as_posix()}",
              name="read_application_log",
              title="Read Application Logs",
              description="Read Inventory Management System Log file",
              mime_type="text/plain")
async def read_application_log() -> str:
    """Reads content from a specific log file asynchronously."""
    try:
        async with aiofiles.open(log_file_path, mode="r") as f:
            content = await f.read()
        return content
    except FileNotFoundError:
        return "Log file not found."

# 4. Direct / Static Resource returning JSON data (dict is auto-serialized)
## Helper Function
def read_json_file(file_path):
    """
    Reads a JSON file, parses it, and returns the data as a Python dictionary.
    Args:
        file_path (str): The path to the JSON file.
    Returns:
        dict or None: The parsed JSON data if successful, otherwise None.
    """
    try:
        # Use 'with' statement for safe file handling.
        # It automatically closes the file even if errors occur.
        with open(file_path, 'r') as file:
            # json.load() reads from a file object and parses the JSON.
            data = json.load(file)
            print(f"Successfully read JSON from '{file_path}'")
            return data
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' contains invalid JSON.")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# Resource
@mcp.resource(uri="data://config",
              name="get_config",
              title="Get Application Configuration",
              description="Get Inventory Management System Configuration in JSON format",
              mime_type="application/json")
async def get_config() -> dict:
    """Reads application configuration as JSON."""
    file_name = 'data/config.json'
    json_data = read_json_file(file_name)
    return json_data

# 5. Exposing a static file directly using FileResource Class
readme_path = Path("data/README.txt").resolve()
if readme_path.exists():
    # Use a file:// URI scheme
    readme_resource = FileResource(
        uri=f"file://{readme_path.as_posix()}",
        path=readme_path, # Path to the actual file
        name="Project README File",
        description="MC-Hilton Inventory Management System README File.",
        mime_type="text/markdown"
    )
    mcp.add_resource(readme_resource)

# 6. Exposing a directory listing
data_dir_path = Path("data/").resolve()
if data_dir_path.is_dir():
    data_listing_resource = DirectoryResource(
        uri="resource://data-files",
        path=data_dir_path, # Path to the directory
        name="Resource Server Directory Listing",
        description="Lists files available in the Server directory.",
        recursive=True # Set to True to list subdirectories
    )
    mcp.add_resource(data_listing_resource) # Returns JSON list of files

# TOOLS=======================================================================================
# Adding Calculator tools
#Tool returns both Text Content and Structured Output
@mcp.tool(
            name = "add",
            title = "add",
            description = "Add two numbers",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        })
async def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool(
            name = "subtract",
            title = "subtract",
            description = "Subtract two numbers",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        })
async def subtract(a: int, b: int) -> int:
    """Subtract two numbers"""
    return a - b

@mcp.tool(
            name = "multiply",
            title = "multiply",
            description = "Multiply two numbers",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        })
async def multiply(a: int, b: int) -> int:
    """multiply two numbers"""
    return a * b

@mcp.tool(
            name = "divide",
            title = "divide",
            description = "Divide two numbers",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        })
async def divide(a: int, b: int) -> int:
    """divide two numbers"""
    if b == 0:
        b = 1
    return a / b

@mcp.tool(
            name = "power",
            title = "power",
            description = "raising to the power",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        }
)
async def power(a: int, b: int) -> int:
    """raising to the power"""
    return a ** b

@mcp.tool(
            name = "exponentiate",
            title = "exponentiate",
            description = "raising e to the power",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        }
)
async def exponentiate(a: int) -> float:
    """raising e to the power"""
    return np.exp(a)

@mcp.tool(
            name = "natural_logarithm",
            title = "natural logarithm",
            description = "compute natural logarithm",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        }
)
async def natural_logarithm(a: float) -> float:
    """raising e to the power"""
    return np.log(a)

@mcp.tool(
        name="get_product",
        description="Retrieve products of a specific category",
        title="Get Product of a Category",
)
async def get_product(query: str, ctx: Context) -> str | list[dict]:
    """Identify the Category of Product discussed in a Query using the client's LLM."""
    df = pd.read_csv("csvs/product.csv")
    categories = str(set(df['Category']))
    prompt = f"""Identify the product category of the following query as {categories}.
    Just output a single word - {categories}.
    Query to analyze: {query}"""
    # Request LLM analysis through sampling
    category = await ctx.sample(messages=prompt,
                                temperature=0.7, 
                                model_preferences=ModelPreferences(
                                    hints=["qwen","claude","gemini"],
                                    costPriority=0.3,
                                    speedPriority=0.8,
                                    intelligencePriority=0.7
                                )
                                )
    print(category.text)
    if category.text in categories:
        response = df[df['Category'] == category.text].to_dict(orient='records')
    else:
        response = "No Data Found!"
    return response

def fetch_users(dataframe, city=None, gender=None):
    """
    Fetches users from the DataFrame based on city, gender, or both.
    Args:
        dataframe (pd.DataFrame): The input DataFrame.
        city (str, optional): The city to filter by. Defaults to None.
        gender (str, optional): The gender to filter by. Defaults to None.
    Returns:
        pd.DataFrame: A DataFrame containing the filtered users.
    """
    query_conditions = pd.Series([True] * len(dataframe)) # Start with all True
    if city:
        query_conditions = query_conditions & (dataframe['City'].str.lower() == city.lower())
    if gender:
        query_conditions = query_conditions & (dataframe['Gender'].str.lower() == gender.lower())
    return dataframe[query_conditions].to_dict(orient='records')

#Tool return Text Content as well as Structured Output as JSON
@mcp.tool(
            name = "search_user",
            title = "search user",
            description = "search user by gender and city",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': True,
                            'openWorldHint': False
                        })
async def search_user(gender: Annotated[str, "gender of user"] | None,
                        city: Annotated[str, "city of user"] | None) -> list[dict]:
    """Search user by gender and city."""
    df = pd.read_csv("csvs/users.csv")
    if gender and city:
        result = fetch_users(df, gender=gender, city=city)
    elif gender:
        result = fetch_users(df, gender=gender)
    elif city:
        result = fetch_users(df, city=city)
    return result

@mcp.tool(
            name = "calculate_average",
            title = "calculate average",
            description = "calculate average of age or salary",
            annotations={
                            'readOnlyHint': True,
                            'destructiveHint': False,
                            'idempotentHint': False,
                            'openWorldHint': False
                        })
async def calculate_average(data: Annotated[list[int] | list[float], "list of numbers"]) -> float:
    """calculate average of numbers"""
    result = 0.0
    if data:
        arr= np.array(data)
        result = np.mean(arr)
    return result

# Using TypedDict for simpler structured output - content
class ServerInfo(TypedDict):
    name: str
    instructions: str | None
    debug_mode: bool
    log_level: str
    host: str
    port: int

"""Tool that uses context capabilities."""
#Tool returns both Text Content and Structured Output as TypedDict
@mcp.tool(  
            name = "server_info",
            title = "server information",
            description = "Get MCP Server information")
async def server_info(ctx: mcpContext[ServerSession, None]) -> ServerInfo:
    """Get information about the current server. Returns structured data"""
    #print(ctx)
    result = ServerInfo(
        name = ctx.fastmcp.name,
        instructions = ctx.fastmcp.instructions,
        debug_mode = ctx.fastmcp.settings.debug,
        log_level = ctx.fastmcp.settings.log_level,
        host = ctx.fastmcp.settings.host,
        port = ctx.fastmcp.settings.port,
    )
    return result

# PROMPTS=======================================================================================
# 1. Basic prompt with simple arguments returning a string (converted to user message automatically) and Decorator Arguments
@mcp.prompt(name="explain-topic",         # Custom prompt name
            title="Prompt Template for explanation",   # Custom description
            description="Generates a user message asking for an explanation of a topic."
            )
def explain_topic(topic: str) -> str:
    """Generates a user message asking for an explanation of a topic. 
    This docstring is ignored when description is provided."""
    return f"Can you please explain the concept of '{topic}'?"

# 2. Basic prompt with structured arguments returning a string (converted to user message automatically) and Decorator Arguments
@mcp.prompt(
    name="summarize_prompt",
    description="Creates a request to summarize a content with specific parameters",
)
def summarize_prompt(
    content_uri: str = Field(description="The URI of the resource containing the content."),
    summary_type: str = Field(default="short", description="Type of summary.")
) -> str:
    """This docstring is ignored when description is provided."""
    return f"Please perform a '{summary_type}' summary on the text found at {content_uri}."

# Return Values
# 3. Prompt returning a specific message type - Example of Inferred Metadata (name=function name, description=docstring)
@mcp.prompt()
def generate_code_request(language: str, task_description: str) -> PromptMessage:
    """Generates a user message requesting code generation."""
    content = f"Write a {language} function that performs the following task: {task_description}"
    return PromptMessage(role="user", content=TextContent(type="text", text=content))

# 4. Prompt returning a list of prompt messages - Example of Inferred Metadata (name=function name, description=docstring)
@mcp.prompt()
def roleplay_scenario(character: str, situation: str) -> list[PromptMessage]:
    """Sets up a roleplaying scenario with initial messages."""
    return [
        Message(f"Let's roleplay. You are {character}. The situation is: {situation}"),
        Message("Okay, I understand. I am ready. What happens next?", role="assistant")
    ]

# 5. Prompt with Required vs. Optional Parameters
@mcp.prompt()
def data_analysis_prompt(
    data_uri: str,                        # Required - no default value
    analysis_type: str = "short",       # Optional - has default value
    include_charts: bool = False          # Optional - has default value
) -> str:
    """Creates a request to analyze data with specific parameters."""
    prompt = f"Please perform a '{analysis_type}' analysis on the data found at {data_uri}."
    if include_charts:
        prompt += " Include relevant charts and visualizations."
    return prompt

def main():
    """Entry point for the direct execution server."""
    mcp.run(
            #transport="stdio" #For STDIO Transport
            transport="streamable-http"
            )
    
if __name__ == "__main__":
    main()
```

## simple_a2a_client/__init__.py

[simple_a2a_client/__init__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/simple_a2a_client/__init__.py) · 0 B

_Empty file._

## simple_a2a_client/__main__.py

[simple_a2a_client/__main__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/simple_a2a_client/__main__.py) · 6.3 KB

```python title="simple_a2a_client/__main__.py"
import logging
from typing import Any
from uuid import uuid4
from rich.pretty import pprint
import httpx
from a2a.client import (
        A2ACardResolver, 
        A2AClient, 
        A2ACardResolver
    )
from a2a.utils.message import get_message_text
from a2a.types import TransportProtocol
from a2a.types import (
    AgentCard,
    MessageSendParams,
    SendMessageRequest,
)
from a2a.utils.constants import (
    AGENT_CARD_WELL_KNOWN_PATH,
)
import warnings
warnings.filterwarnings("ignore")
def get_user_query() -> str:
    return input('\n> ')
    
def print_initwelcome_message() -> None:
    print("\n\n")
    print('==================================Welcome to the A2A client!======================================')
    print("Example: Communicating with a Remote A2A Server")
    print("==================================================================================================")
    print("Please enter your query (type 'exit' to quit):\n")
async def main() -> None:
    # Configure logging to show INFO level messages
    
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)  # Get a logger instance
    # URL of the Remote Agent hosted via A2A Protocol Server 
    base_url = 'http://127.0.0.1:8024'
    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as httpx_client:
        # Initialize A2ACardResolver
        resolver = A2ACardResolver(
            httpx_client=httpx_client,
            base_url=base_url,
        )
        
        # Fetch Public Agent Card and Initialize Client
        agent_card: AgentCard | None = None
        logger.info(
            f'Attempting to fetch public agent card from: {base_url}{AGENT_CARD_WELL_KNOWN_PATH}'
        )
        try:
            agent_card = (
                await resolver.get_agent_card()
            )  # Fetches from default public path
            logger.info('Successfully fetched public agent card')
            pprint(agent_card)
            
            logger.info(
                '\nUsing PUBLIC agent card for client initialization (default).'
            )
        except Exception as e:
            logger.error(f'Critical error fetching public agent card: {e}', exc_info=True)
            raise RuntimeError('Failed to fetch the public agent card. Cannot continue.') from e
        client = A2AClient(httpx_client=httpx_client, 
                           agent_card=agent_card
                        )
        logger.info('A2AClient initialized.')
        print_initwelcome_message()
        while True:
            user_input = get_user_query()
            if user_input.lower() == 'exit':
                print('bye!~')
                break
            try:
                # Create the message object
                send_message_payload: dict[str, Any] = {
                    'message': {
                        'role': 'user',
                        'parts': [
                            {'kind': 'text', 'text': user_input}
                        ],
                        'messageId': uuid4().hex,
                    },
                }
                
                # Send the message to the A2A server
                request = SendMessageRequest(
                    id=str(uuid4()), params=MessageSendParams(**send_message_payload)
                )
                response = await client.send_message(request)
                # Check if response has root
                if not hasattr(response, 'root') or not response.root:
                    logger.error("Response missing 'root' attribute")
                    return "Error: Invalid response format from A2A server"
                    
                # Check if root is an error response
                if hasattr(response.root, 'error') and response.root.error:
                    logger.error(f"A2A server error: {response.root.error}")
                    return f"A2A Server Error: {response.root.error}"
                    
                # Check if root has result (success response)
                if not hasattr(response.root, 'result') or not response.root.result:
                    logger.error("Response missing 'result' attribute")
                    return "Error: Invalid response format from A2A server"
                
                # Extract response data
                result = response.root.result
                pprint(result)
                
                # Get the response content from artifacts
                # Check if Result has Artifact(s)
                # If Result has multiple Artifacts
                if hasattr(result, 'artifacts') and result.artifacts:
                    # Extract content from the first artifact
                    artifact = result.artifacts[0]
                # If Result has a Single Artifact
                elif hasattr(result, 'artifact') and result.artifact:
                    # Extract content from the only artifact available
                    artifact = result.artifact
                # Fallback: check for content in other locations
                elif hasattr(result, 'content') and result.content:
                    logger.info(f"Successfully retrieved response from A2A server")
                    content = result.content
                    print("Ans:", content,"\n")
                else:
                    logger.warning("No content found in A2A server response")
                    print("No response content received from A2A server")
                # When Artifact Exists then Retrieve the Text Content from the Root object of its Part
                if artifact:
                	# Checks if Artifact has Part object
                    if hasattr(artifact, 'parts') and artifact.parts:
                        part = artifact.parts[0]
                        # Checks if Part has Root object and Root has text
                        if hasattr(part, 'root') and hasattr(part.root, 'text'):
                            content = part.root.text
                            logger.info(f"Successfully retrieved response from A2A server")
                            print("Ans:", content,"\n")
            except Exception as e:
                logger.error(f"Error communicating with A2A server: {e}")
                logger.error(f"Error type: {type(e).__name__}")
                print(f"Error communicating with A2A server: {str(e)}")
if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
```

## stream_client/stream_a2a_client.py

[stream_client/stream_a2a_client.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/stream_client/stream_a2a_client.py) · 3.3 KB

```python title="stream_client/stream_a2a_client.py"
import asyncio
import logging
from typing import Any
from uuid import uuid4
from rich.pretty import pprint
import httpx
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import (
    AgentCard,
    MessageSendParams,
    SendStreamingMessageRequest,
)
from a2a.utils.constants import AGENT_CARD_WELL_KNOWN_PATH
from a2a.utils.message import get_message_text


def get_user_query() -> str:
    return input('\n> ')


def print_initwelcome_message() -> None:
    print('\n\n')
    print('Streaming Example : Understanding A2A server streaming operations')


async def main() -> None:
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    base_url = 'http://127.0.0.1:8024'

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as httpx_client:
        resolver = A2ACardResolver(httpx_client=httpx_client, base_url=base_url)
        try:
            agent_card = await resolver.get_agent_card()
            logger.info('Fetched agent card')
            pprint(agent_card)
        except Exception as e:
            logger.error(f'Failed to fetch agent card: {e}')
            return

        client = A2AClient(httpx_client=httpx_client, agent_card=agent_card)
        print_initwelcome_message()
        while True:
            user_input = get_user_query()
            if user_input.lower() == 'exit':
                print('bye!~')
                break

            send_message_payload: dict[str, Any] = {
                'message': {
                    'role': 'user',
                    'parts': [
                        {'kind': 'text', 'text': user_input}
                    ],
                    'messageId': uuid4().hex,
                },
            }

            request = SendStreamingMessageRequest(id=str(uuid4()), params=MessageSendParams(**send_message_payload))
            try:
                stream = client.send_message_streaming(request)
                # stream is an async iterator of A2A client events/messages
                async for event in stream:
                    # Print raw event for visibility
                    pprint(event)
                    # The a2a client returns either Message or Task events; try extracting text
                    try:
                        if hasattr(event, 'root') and event.root and hasattr(event.root, 'result') and event.root.result:
                            result = event.root.result
                            # If artifacts present, extract text
                            if hasattr(result, 'artifacts') and result.artifacts:
                                artifact = result.artifacts[0]
                                if hasattr(artifact, 'parts') and artifact.parts:
                                    part = artifact.parts[0]
                                    if hasattr(part, 'root') and hasattr(part.root, 'text'):
                                        print('\nAns chunk:', part.root.text, '\n')
                            elif hasattr(result, 'content') and result.content:
                                print('\nAns chunk:', result.content, '\n')
                    except Exception:
                        pass

            except Exception as e:
                logger.error(f'Error during streaming request: {e}')


if __name__ == '__main__':
    asyncio.run(main())
```

## web_search_a2a_sever_agent/__init__.py

[web_search_a2a_sever_agent/__init__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/web_search_a2a_sever_agent/__init__.py) · 0 B

_Empty file._

## web_search_a2a_sever_agent/__main__.py

[web_search_a2a_sever_agent/__main__.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/web_search_a2a_sever_agent/__main__.py) · 2.8 KB

```python title="web_search_a2a_sever_agent/__main__.py"
import sys, httpx, click, logging, uvicorn
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
)
from a2a.server.tasks import (
    BasePushNotificationSender,
    InMemoryPushNotificationConfigStore,
    InMemoryTaskStore,
)
from .agent_executor import WebSearchAgentExecutor
from .WebSearchAgent import WebsearchAgent
from dotenv import load_dotenv
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@click.command()
@click.option('--host', 'host', default='127.0.0.1')
@click.option('--port', 'port', default=8024)
def main(host, port):
    try:
        # Defining Agent Skills, capabilities and Agent Card --------------------------
        capabilities = AgentCapabilities(streaming=True, push_notifications=True)
        skill = AgentSkill(
            id='web_search',
            name='Perform Web search',
            description='perform real-time information retrieval from open internet using google search',
            tags=['search', 'web'],
            examples=['Which tean won Asia Cup in 2025?'],
        )
        agent_card = AgentCard(
            name='Websearch Agent',
            description='Helps with searching and retrieving real-time information on any topic from the open internet using google search',
            url=f'http://{host}:{port}/',
            version='1.0.0',
            default_input_modes=WebsearchAgent.SUPPORTED_CONTENT_TYPES,
            default_output_modes=WebsearchAgent.SUPPORTED_CONTENT_TYPES,
            capabilities=capabilities,
            skills=[skill],
        )
        httpx_client = httpx.AsyncClient(timeout=httpx.Timeout(60.0))
        push_config_store = InMemoryPushNotificationConfigStore()
        push_sender = BasePushNotificationSender(httpx_client=httpx_client,
                        config_store=push_config_store)
        
        # Creating the Request Handler---------------------------------------------
        request_handler = DefaultRequestHandler(
            agent_executor=WebSearchAgentExecutor(),
            task_store=InMemoryTaskStore(),
            push_config_store=push_config_store,
            push_sender= push_sender,
        )

        # Creating the A2A Starlette Application with the Agent Card and Request Handler
        server = A2AStarletteApplication(
            agent_card=agent_card,
            http_handler=request_handler,
        )
        # Running the Uvicorn Server ----------------------------------------------
        uvicorn.run(server.build(), host=host, port=port)
       
    except Exception as e:
        logger.error(f'An error occurred during server startup: {e}')
        sys.exit(1)
 
if __name__ == '__main__':
    main()
```

## web_search_a2a_sever_agent/agent_executor.py

[web_search_a2a_sever_agent/agent_executor.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/web_search_a2a_sever_agent/agent_executor.py) · 3.5 KB

```python title="web_search_a2a_sever_agent/agent_executor.py"
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.utils import new_task
import logging
from a2a.types import (
    InternalError,
    InvalidRequestError,
    Part,
    TextPart,
    UnsupportedOperationError,
)
from a2a.utils.errors import ServerError
from .WebSearchAgent import WebsearchAgent


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WebSearchAgentExecutor(AgentExecutor):
    """Websearch Remote Agent Implementation."""
    def __init__(self):
        self.agent = WebsearchAgent()
    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
		# Checking if Context Exists ------------------------------------------
        if not context:
            raise ServerError(error=InvalidRequestError())
        
        # Getting the Message (query) sent from the A2A Client ----------------
        query = context.get_user_input()
        
        task = context.current_task
        print("="*20,"Context Information","="*30)
        print("Context Id:",context.context_id)
        print("query:",query)
        print("Task Id:",context.task_id)
        print("Context Task:",task)
        print("Context Message:",context.message)
        print("-"*70)
        # Creating a New Task if Task does not exists. And adding the same to the event queue.
        if not task:
            task = new_task(context.message)  # type: ignore
            await event_queue.enqueue_event(task)
        # Creating the Task Updater for the Current Task (Task Id) and Context (Context Id)---------
        # - Which adds the Task Updates (Status or concrete Artifacts - responses) to the Event Queue
        updater = TaskUpdater(event_queue, task.id, task.context_id)
        # Invoking the Agent with the received query -----------------------------
        try:
            # Inform that the task is in working state
            await updater.start_work()

            # Stream response from the agent and publish chunked artifacts
            first = True
            artifact_id = None
            async for chunk in self.agent.stream(query, task.context_id):
                # Each chunk is expected to be a dict with 'text' and 'is_last'
                text = chunk.get('text', '')
                last = bool(chunk.get('is_last', False))

                # Build a Part with the text chunk
                part = Part(root=TextPart(text=text))

                # For streaming, use append=True for intermediate chunks and last_chunk flag
                await updater.add_artifact(
                    parts=[part],
                    artifact_id=artifact_id,
                    name='websearch_result',
                    append=not first,
                    last_chunk=last,
                )
                first = False
                # After first add, subsequent adds should reuse same artifact id - TaskUpdater will generate id when None
                if last:
                    # mark completion
                    await updater.complete()
                    break

        except Exception as e:
            logger.error(f'An error occurred while getting the response: {e}')
            # publish failed state
            await updater.failed()
            raise ServerError(error=InternalError()) from e
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        raise ServerError(error=UnsupportedOperationError())
```

## web_search_a2a_sever_agent/WebSearchAgent.py

[web_search_a2a_sever_agent/WebSearchAgent.py](kb-file:18CSC305J-Artificial%20intellegence/agentic_AI/demo-master/web_search_a2a_sever_agent/WebSearchAgent.py) · 4.2 KB

```python title="web_search_a2a_sever_agent/WebSearchAgent.py"
from langchain_ollama.chat_models import ChatOllama
#from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_aws import ChatBedrockConverse
from langchain_community.utilities import SerpAPIWrapper
from langchain_core.tools import Tool
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langgraph.checkpoint.memory import InMemorySaver
from typing import Any, AsyncIterable
import asyncio
from langchain.agents import create_agent
load_dotenv()

llm = ChatBedrockConverse(model="amazon.nova-lite-v1:0", region_name="us-east-1",temperature=0.9)
params = {
    "engine": "google",
    "gl": "in",
    "hl": "en",
    "num": 10,
}
websearch = SerpAPIWrapper(params=params)
class SerpInputs(BaseModel):
    """Inputs to the SerpAPI tool."""
    query: str = Field(
        description="query to look up in open internet"
    )
websearch_tool = Tool(
    name="perform_websearch",
    description="Perform real-time search in the open web using google.",
    func=websearch.run,
    args_schema=SerpInputs,
)
class WebsearchAgent:
    async def stream(self, query, content_id) -> AsyncIterable[dict[str, Any]]:
        """Async generator that streams incremental chunks of the agent response.

        Implementation note: the underlying websearch tool returns a full result
        in this codebase. For a streaming demo we call the synchronous
        invoke() to produce the final content and then yield it in smaller
        chunks so the server and client can exercise streaming behaviour.
        """
        # Produce the complete answer using the existing invoke path.
        # Keep this synchronous invocation to reuse the agent logic.
        result = self.invoke(query, content_id)
        content = result.get('content') or ''

        # Defensive: if no content, yield an empty final chunk
        if not content:
            yield {'text': '', 'is_last': True}
            return

        # Split into chunks (by sentence or by fixed size fallback)
        # Try splitting on sentences first for nicer partial outputs.
        import re
        sentences = re.split(r'(?<=[\.\?!])\s+', content)
        if len(sentences) <= 1:
            # fallback to fixed-size chunks
            chunk_size = 200
            sentences = [content[i : i + chunk_size] for i in range(0, len(content), chunk_size)]

        # Yield each chunk with a small await to allow cooperative scheduling
        for i, s in enumerate(sentences):
            # Trim and skip empty
            text = s.strip()
            if not text:
                continue
            await asyncio.sleep(0)  # allow event loop to interleave
            yield {'text': text, 'is_last': i == len(sentences) - 1}
    SUPPORTED_CONTENT_TYPES = ['text', 'text/plain']
    SYSTEM_INSTRUCTION = (
            "You are a specialized assistant for for question-answering tasks which search the web to retreive relevant information on a given topic from the open internet. "
            "Your sole purpose is to use the 'perform_websearch' tool to Search the web to retrieve latest relevant information required to answer the given query.\n"
            "Use the retrieved relevant information to answer the question. \n"
            "Summarize over the retrieved contents to formulate a comprehensive answer. \n"
            "Important:\n"
            " - Provide well structured output with section headings. \n"
            " - use lists, tables, and bullet points if required. \n"
            "If you don't know the answer, just say that you don't know. \n"    
    )
    def __init__(self):
        self.model = llm
        self.tools = [websearch_tool]
        self.graph = create_agent(
            self.model,
            tools=self.tools,
            checkpointer=InMemorySaver(),
            system_prompt=self.SYSTEM_INSTRUCTION,
            debug=True
        )
    def invoke(self, query, context_id) -> dict[str, Any]:
        inputs = {'messages': [('user', query)],'status':'submitted'}
        config = {'configurable': {'thread_id': context_id}}
        print(inputs)
        output = self.graph.invoke(inputs,config=config)
        message = output['messages'][-1].content
        return {
                    'is_task_complete': True,
                    'content':message,
                }
```
