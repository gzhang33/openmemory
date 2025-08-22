# OpenMemory
**Language / 语言：** [English README](README.md)

OpenMemory 是您的个人 LLM 记忆层 - 私有、可移植且开源。您的记忆存储在本地，让您完全控制数据安全。构建具有个性化记忆的 AI 应用，同时确保数据安全。

## MCP 改进分析

### 原项目的问题

原始 OpenMemory 项目在 MCP（模型上下文协议）集成方面遇到了一些挑战：

1. **FastMCP 初始化失败** - 使用不支持的参数导致 "no tools or prompts" 错误
2. **内存客户端依赖问题** - 当外部依赖不可用时服务器崩溃
3. **MCP 工具响应格式错误** - 返回字典对象违反了 MCP 协议要求
4. **SSE 路由处理问题** - 上下文变量管理不当

### 当前项目的改进

本项目通过全面修复解决了上述问题：

1. **FastMCP 初始化修复** - 移除不支持的参数，确保正确初始化
2. **懒加载内存客户端** - 优雅的错误处理和降级机制
3. **标准化的 MCP 工具响应** - 所有工具现在返回 JSON 字符串格式
4. **改进的 SSE 路由管理** - 正确的上下文变量处理和多用户支持
5. **增强的权限和访问控制** - 基于应用的内存访问权限检查

### 新增工具

**新增的 MCP 工具：**

1. **`get_memory_stats`** - 获取记忆统计信息
   - 功能：返回用户的记忆总数、最近7天记忆数等统计信息
   - 用途：帮助用户了解自己的记忆存储状态

2. **`check_connection`** - 检查连接状态
   - 功能：检查 OpenMemory 服务的连接状态和内存客户端可用性
   - 用途：连接诊断和系统状态监控

### 解决的问题

- ✅ "no tools or prompts" 错误已修复
- ✅ MCP 客户端现在可以正确识别工具
- ✅ 服务器在外部依赖不可用时仍能正常运行
- ✅ 工具调用返回正确的 JSON 格式
- ✅ 支持多用户并发访问
- ✅ 新增状态监控和统计工具

---



![OpenMemory](https://github.com/user-attachments/assets/3c701757-ad82-4afa-bfbe-e049c2b4320b)

## 快速设置

### 安装要求
- Docker
- OpenAI API 密钥

您可以通过运行以下命令快速运行 OpenMemory：

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | bash
```

您应该将 `OPENAI_API_KEY` 设置为全局环境变量：

```bash
export OPENAI_API_KEY=your_api_key
```

您也可以将 `OPENAI_API_KEY` 作为参数传递给脚本：

```bash
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | OPENAI_API_KEY=your_api_key bash
```

## 安装要求

- Docker 和 Docker Compose
- Python 3.9+
- Node.js（用于前端开发）
- OpenAI API 密钥（用于 LLM 交互）

## 快速开始

### 1. 设置环境变量

在运行项目之前，您需要为 API 和 UI 配置环境变量。

您可以通过以下方式之一完成此操作：

- **手动方式**：
  创建以下目录中的 `.env` 文件：
  - `/api/.env`
  - `/ui/.env`

- **使用 `.env.example` 文件**：
  复制并重命名示例文件：

  ```bash
  cp api/.env.example api/.env
  cp ui/.env.example ui/.env
  ```

  - **使用 Makefile**（如果支持）：
    运行：

   ```bash
   make env
   ```

#### `/api/.env` 示例

```env
OPENAI_API_KEY=sk-xxx
USER=<user-id> # 您要关联记忆的用户ID
```

#### `/ui/.env` 示例

```env
NEXT_PUBLIC_API_URL=http://localhost:8765
NEXT_PUBLIC_USER_ID=<user-id> # API 环境变量中的相同用户ID
```

### 2. 构建和运行项目

您可以使用以下两个命令运行项目：
```bash
make build # 构建 mcp 服务器和 UI
make up  # 运行 openmemory mcp 服务器和 UI
```

运行这些命令后，您将拥有：
- OpenMemory MCP 服务器运行在：http://localhost:8765（API 文档在 http://localhost:8765/docs 可用）
- OpenMemory UI 运行在：http://localhost:3000

#### UI 在 `localhost:3000` 上不工作？

如果 UI 不能在 [http://localhost:3000](http://localhost:3000) 上正常启动，请手动运行：

```bash
cd ui
pnpm install
pnpm dev
```

### MCP 客户端设置

使用以下一步式命令将 OpenMemory 本地 MCP 配置到客户端。一般命令格式为：

```bash
npx @openmemory/install local http://localhost:8765/mcp/<client-name>/sse/<user-id> --client <client-name>
```

将 `<client-name>` 替换为所需的客户端名称，将 `<user-id>` 替换为环境变量中指定的值。

## 项目结构

- `api/` - 后端 API + MCP 服务器
- `ui/` - React 前端应用

## 贡献

我们是一群热爱 AI 和开源软件未来的开发者。在这两个领域拥有多年经验，我们相信社区驱动开发的强大力量，并很高兴构建能够让 AI 更易于访问和个性化的工具。

我们欢迎所有形式的贡献：
- 错误报告和功能请求
- 文档改进
- 代码贡献
- 测试和反馈
- 社区支持

如何贡献：

1. Fork 本仓库
2. 为您的功能创建一个分支（`git checkout -b openmemory/feature/amazing-feature`）
3. 提交您的更改（`git commit -m 'Add some amazing feature'`）
4. 推送到分支（`git push origin openmemory/feature/amazing-feature`）
5. 打开一个 Pull Request

加入我们，共同构建 AI 记忆管理的未来！您的贡献帮助让 OpenMemory 对所有人更好。
