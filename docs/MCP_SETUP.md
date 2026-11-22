# Remote Works MCP

MCP ini menghubungkan AI client langsung ke koleksi Firestore yang sama dengan aplikasi web:

- `applications`
- `jobSources`
- `jobDirectories`

## Prasyarat

1. Jalankan `npm install`.
2. Salin `.env.example` menjadi `.env.local`.
3. Isi Firebase web config yang tersedia di aplikasi.
4. Pastikan Firestore rules mengizinkan operasi yang dibutuhkan.

API key Firebase bukan service-account secret. Untuk proteksi write, gunakan Firebase Authentication dan rules yang ketat. Jangan membagikan `.env.local`.

## Claude Desktop atau Cursor

Tambahkan konfigurasi berikut ke MCP config client:

```json
{
  "mcpServers": {
    "remote-works": {
      "command": "node",
      "args": ["/absolute/path/to/remote_works/scripts/mcp-server.mjs"],
      "cwd": "/absolute/path/to/remote_works"
    }
  }
}
```

Atau gunakan repo `.mcp.json` bila client mendukungnya.

## HTTP mode

Untuk connector yang membutuhkan endpoint HTTP:

```bash
MCP_ACCESS_TOKEN="buat-token-panjang" npm run mcp:http
```

Endpoint: `http://127.0.0.1:8787/mcp`

Authorization: `Bearer buat-token-panjang`

Mode HTTP hanya binding ke localhost secara default. Jalankan di server/VPS bila ingin connector remote; selalu gunakan TLS/reverse proxy dan bearer token.

## Tool tersedia

- `list_applications`, `create_application`, `bulk_create_applications`, `update_application`, `delete_application`
- `list_job_sources`, `create_job_source`, `update_job_source`, `delete_job_source`
- `list_job_directories`, `create_job_directory`
- `get_summary`
