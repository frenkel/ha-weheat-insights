# Development

## Python

```bash
uv venv --python 3.14 .venv
uv pip install --python .venv/bin/python -r requirements_test.txt
.venv/bin/ruff check . && .venv/bin/ruff format --check .
.venv/bin/pytest
```

The calculation logic lives in `custom_components/weheat_insights/calculations/`
as pure functions with no Home Assistant imports, so it can be tested with
plain fixture data.

## Frontend

The dashboard strategy is TypeScript in `frontend/src/`, bundled with esbuild
into `custom_components/weheat_insights/www/weheat-insights.js`. The bundle is
committed so HACS users need no build step; CI fails if it is out of date.

```bash
cd frontend
npm ci
npm run check   # typecheck + build
```

Rebuild and commit the bundle with every frontend change.

## Local Home Assistant

```bash
docker compose up -d
```

Open <http://localhost:8123>, finish onboarding, then:

1. Add the core **Weheat** integration and sign in with your Weheat account.
2. Add **Weheat Insights** and pick your heat pump.
3. Create a new dashboard from scratch, open the raw configuration editor and use:

   ```yaml
   strategy:
     type: custom:weheat-insights
   ```

The integration directory is mounted read-only into the container. After a
Python change, restart Home Assistant (`docker compose restart`). After a
frontend change, rebuild the bundle and hard-refresh the browser.

`dev/config/` holds the instance's state and is ignored by git, except for
`configuration.yaml`.
