# OpenMemory
**Language / 语言:** [中文版 README](README-zh.md)

OpenMemory is your personal memory layer for LLMs - private, portable, and open-source. Your memories live locally, giving you complete control over your data. Build AI applications with personalized memories while keeping your data secure.

## MCP Improvements Analysis

### Issues with the Original Project

The original OpenMemory project encountered several challenges with MCP (Model Context Protocol) integration:

1. **FastMCP Initialization Failure** - Use of unsupported parameters caused "no tools or prompts" errors
2. **Memory Client Dependency Issues** - Server crashes when external dependencies became unavailable
3. **MCP Tool Response Format Errors** - Returning dictionary objects violated MCP protocol requirements
4. **SSE Route Handling Issues** - Poor context variable management

### Improvements in the Current Project

This project addresses the above issues with comprehensive fixes:

1. **FastMCP Initialization Fix** - Removed unsupported parameters for proper initialization
2. **Lazy Loading Memory Client** - Graceful error handling and fallback mechanisms
3. **Standardized MCP Tool Responses** - All tools now return JSON string format
4. **Improved SSE Route Management** - Proper context variable handling and multi-user support
5. **Enhanced Permissions and Access Control** - Application-based memory access permission checks

### New Tools Added

**New MCP Tools:**

1. **`get_memory_stats`** - Get memory statistics
   - Function: Returns user's total memory count, recent 7-day memory count, and other statistics
   - Purpose: Helps users understand their memory storage status

2. **`check_connection`** - Check connection status
   - Function: Checks OpenMemory service connection status and memory client availability
   - Purpose: Connection diagnostics and system status monitoring

### Issues Resolved

- ✅ "no tools or prompts" error has been fixed
- ✅ MCP clients can now properly recognize tools
- ✅ Server continues running when external dependencies are unavailable
- ✅ Tool calls return correct JSON format
- ✅ Multi-user concurrent access supported
- ✅ New status monitoring and statistics tools added

---



![OpenMemory](https://github.com/user-attachments/assets/3c701757-ad82-4afa-bfbe-e049c2b4320b)

## Easy Setup

### Prerequisites
- Docker
- OpenAI API Key

You can quickly run OpenMemory by running the following command:

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | bash
```

You should set the `OPENAI_API_KEY` as a global environment variable:

```bash
export OPENAI_API_KEY=your_api_key
```

You can also set the `OPENAI_API_KEY` as a parameter to the script:

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | OPENAI_API_KEY=your_api_key bash
```

## Prerequisites

- Docker and Docker Compose
- Python 3.9+ (for backend development)
- Node.js (for frontend development)
- OpenAI API Key (required for LLM interactions, run `cp api/.env.example api/.env` then change **OPENAI_API_KEY** to yours)

## Quickstart

### 1. Set Up Environment Variables

Before running the project, you need to configure environment variables for both the API and the UI.

You can do this in one of the following ways:

- **Manually**:  
  Create a `.env` file in each of the following directories:
  - `/api/.env`
  - `/ui/.env`

- **Using `.env.example` files**:  
  Copy and rename the example files:

  ```bash
  cp api/.env.example api/.env
  cp ui/.env.example ui/.env
  ```

 - **Using Makefile** (if supported):  
    Run:
  
   ```bash
   make env
   ```
- #### Example `/api/.env`

```env
OPENAI_API_KEY=sk-xxx
USER=<user-id> # The User Id you want to associate the memories with 
```
- #### Example `/ui/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:8765
NEXT_PUBLIC_USER_ID=<user-id> # Same as the user id for environment variable in api
```

### 2. Build and Run the Project
You can run the project using the following two commands:
```bash
make build # builds the mcp server and ui
make up  # runs openmemory mcp server and ui
```

After running these commands, you will have:
- OpenMemory MCP server running at: http://localhost:8765 (API documentation available at http://localhost:8765/docs)
- OpenMemory UI running at: http://localhost:3000

#### UI not working on `localhost:3000`?

If the UI does not start properly on [http://localhost:3000](http://localhost:3000), try running it manually:

```bash
cd ui
pnpm install
pnpm dev
```

### MCP Client Setup

Use the following one step command to configure OpenMemory Local MCP to a client. The general command format is as follows:

```bash
npx @openmemory/install local http://localhost:8765/mcp/<client-name>/sse/<user-id> --client <client-name>
```

Replace `<client-name>` with the desired client name and `<user-id>` with the value specified in your environment variables.


## Project Structure

- `api/` - Backend APIs + MCP server
- `ui/` - Frontend React application

## Contributing

We are a team of developers passionate about the future of AI and open-source software. With years of experience in both fields, we believe in the power of community-driven development and are excited to build tools that make AI more accessible and personalized.

We welcome all forms of contributions:
- Bug reports and feature requests
- Documentation improvements
- Code contributions
- Testing and feedback
- Community support

How to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b openmemory/feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin openmemory/feature/amazing-feature`)
5. Open a Pull Request

Join us in building the future of AI memory management! Your contributions help make OpenMemory better for everyone.
