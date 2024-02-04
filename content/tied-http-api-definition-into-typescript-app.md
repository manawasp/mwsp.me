---
title: Automate REST API Definition into Typescript App
publishedAt: 2024-01-11T15:00:00.000+00:00
lang: en
duration: 15 min
category: api
toc: true
---

We may build product separating the frontend and backend using the SPA with API pattern, as all architecture decisions it comes with advantage and cons. <br>One of the cons comes from the API integration into the frontend, usually the integration is prone to error and mistake due to miscommunication.

✨ We will explore here a solution to **minimize HTTP API integration**.

Last decade a specification arise helping describing web service, the [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) previously know as [Swagger Specification (wikipedia)](https://en.wikipedia.org/wiki/OpenAPI_Specification). The solution presented is based on open source tools built around this specification.

## Summary

1. We will build a Rest API with **FastAPI** • [Python3.11+ required](https://www.python.org/downloads/)
2. Generate the TS client • [nodejs required](https://nodejs.org/)
3. Explore the package
5. Enhancement of the package
4. Look for automation with CI
5. Some extra

## REST API with FastAPI (Python)

### Build the http api

Build a [FastAPI](https://fastapi.tiangolo.com/) which natively generates openapi.

First instantiate a venv

```sh
$ python3.12 -m venv venv
$ source env/bin/activate
(venv) $
```

Then we can install fastapi & pydantic:

```sh
(venv) $ pip install fastapi pydantic
...
Successfully installed annotated-types-0.6.0 anyio-4.2.0 fastapi-0.109.0 idna-3.6 pydantic-2.5.3 pydantic-core-2.14.6 sniffio-1.3.0 starlette-0.35.1 typing-extensions-4.9.0
```

We will build a FastAPI app, following CRUD principles.

Let's start defining the resource "recipe" which will be retrieved in two form as "list" and "object".

::code-group

```python [schemas.py]
from datetime import datetime
from typing import Optional

from pydantic import (
    BaseModel,
    Field,
)

# region output

class Recipe(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

class ListRecipes(BaseModel):
    recipes: list[Recipe]
    total: int = Field(
        ...,
        title="Total number of available resources",
        example=260,
    )

# endregion

# region input

class PostRecipePayload(BaseModel):
    name: str
    description: str

class PatchRecipePayload(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

# endregion
```

```python [main.py]
from datetime import datetime

from fastapi import FastAPI

from schemas import ListRecipes, PatchRecipePayload, PostRecipePayload, Recipe

app = FastAPI()

LEMON_RECIPE = Recipe(
    id=1,
    name="Lemon tart",
    description="A lemon tart (French: tarte au citron) is a dessert dish, a variety of tart. It has a pastry shell with a lemon flavored filling.",
    created_at=datetime.now(),
)

@app.get(
    "/recipes",
    name="recipes listing",
    tags=["recipes"],
)
def recipes_list() -> ListRecipes:
    return ListRecipes(recipes=[LEMON_RECIPE], total=1)

@app.post(
    "/recipes",
    name="recipes create",
    tags=["recipes"],
    status_code=201,
)
def recipes_create(payload: PostRecipePayload) -> Recipe:
    return LEMON_RECIPE

@app.get(
    "/recipes/{recipe_id}",
    name="recipes retrieve",
    tags=["recipes"],
)
def recipes_retrieve(recipe_id: int) -> Recipe:
    return LEMON_RECIPE

@app.patch(
    "/recipes/{recipe_id}",
    name="recipes updated",
    tags=["recipes"],
)
def recipes_updated(payload: PatchRecipePayload, recipe_id: int) -> Recipe:
    return LEMON_RECIPE

@app.patch(
    "/recipes/{recipe_id}",
    name="recipes delete",
    tags=["recipes"],
    status_code=204,
)
def recipes_delete(recipe_id: int) -> None:
    return None

```

```python [__init__.py]

```

::

Don't forget to add a `__init__.py`. We can ensure everything is working well:

```sh
(venv) $ python -m uvicorn main:app
INFO:     Started server process [35909]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

In another terminal use `curl` and `jq` to interact with the api

```sh
$ curl -X GET http://127.0.0.1:8000/recipes | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   240  100   240    0     0   104k      0 --:--:-- --:--:-- --:--:--  117k
{
  "recipes": [
    {
      "id": 1,
      "name": "Lemon tart",
      "description": "A lemon tart (French: tarte au citron) is a dessert dish, a variety of tart. It has a pastry shell with a lemon flavored filling.",
      "created_at": "2024-01-13T11:03:22.971236"
    }
  ],
  "total": 1
}
```

### Get the `openapi.json`

FastAPI by default expose the openapi.json under the same name path so doing a `curl -X GET http://127.0.0.1:8000/openapi.json` will print the API OAS specification which can be saved:

```sh
$ curl -X GET http://127.0.0.1:8000/openapi.json -o openapi.json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3312  100  3312    0     0  1532k      0 --:--:-- --:--:-- --:--:-- 3234k
```

```sh
$ cat openapi.json
{"openapi":"3.1.0","info":{"title":"FastAPI","version":"0.1.0"},"paths":{"/recipes":{"get":{"tags":["recipes"],"summary":"Recipes Listing","operationId":"recipes_listing_recipes_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ListRecipes"}}}}}},"post":{"tags":["recipes"],"summary":"Recipes Create","operationId":"recipes_create_recipes_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/PostRecipePayload"}}},"required":true},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Recipe"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/recipes/{recipe_id}":{"get":{"tags":["recipes"],"summary":"Recipes Retrieve","operationId":"recipes_retrieve_recipes__recipe_id__get","parameters":[{"name":"recipe_id","in":"path","required":true,"schema":{"type":"integer","title":"Recipe Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Recipe"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"patch":{"tags":["recipes"],"summary":"Recipes Delete","operationId":"recipes_delete_recipes__recipe_id__patch","parameters":[{"name":"recipe_id","in":"path","required":true,"schema":{"type":"integer","title":"Recipe Id"}}],"responses":{"204":{"description":"Successful Response"},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}}},"components":{"schemas":{"HTTPValidationError":{"properties":{"detail":{"items":{"$ref":"#/components/schemas/ValidationError"},"type":"array","title":"Detail"}},"type":"object","title":"HTTPValidationError"},"ListRecipes":{"properties":{"recipes":{"items":{"$ref":"#/components/schemas/Recipe"},"type":"array","title":"Recipes"},"total":{"type":"integer","title":"Total number of available resources","example":260}},"type":"object","required":["recipes","total"],"title":"ListRecipes"},"PatchRecipePayload":{"properties":{"name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Name"},"description":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Description"}},"type":"object","title":"PatchRecipePayload"},"PostRecipePayload":{"properties":{"name":{"type":"string","title":"Name"},"description":{"type":"string","title":"Description"}},"type":"object","required":["name","description"],"title":"PostRecipePayload"},"Recipe":{"properties":{"id":{"type":"integer","title":"Id"},"name":{"type":"string","title":"Name"},"description":{"type":"string","title":"Description"},"created_at":{"type":"string","format":"date-time","title":"Created At"}},"type":"object","required":["id","name","description","created_at"],"title":"Recipe"},"ValidationError":{"properties":{"loc":{"items":{"anyOf":[{"type":"string"},{"type":"integer"}]},"type":"array","title":"Location"},"msg":{"type":"string","title":"Message"},"type":{"type":"string","title":"Error Type"}},"type":"object","required":["loc","msg","type"],"title":"ValidationError"}}}}
```

## Typescript client package

### Generate the typescript client

There is multiple package to generate client from an OpenAPI specification the most starred one is [openapi-generator](https://github.com/OpenAPITools/openapi-generator), here we will use a smaller library focused on generating typescript client and easier to use [`openapi-typescript-codegen`](https://github.com/ferdikoomen/openapi-typescript-codegen).

```sh
> npx openapi-typescript-codegen --input openapi.json --output client --useOptions --name FoodyClient
Need to install the following packages:
  openapi-typescript-codegen@0.26.0
Ok to proceed? (y) y
```

A new folder `client` should have appeared:

```sh
$ ls
client  __init__.py  main.py  openapi.json  schemas.py
```

### Explore the generated package

```sh
$ tree client
client
├── core
│   ├── ApiError.ts
│   ├── ApiRequestOptions.ts
│   ├── ApiResult.ts
│   ├── BaseHttpRequest.ts
│   ├── CancelablePromise.ts
│   ├── FetchHttpRequest.ts
│   ├── OpenAPI.ts
│   └── request.ts
├── FoodyClient.ts
├── index.ts
├── models
│   ├── HTTPValidationError.ts
│   ├── ListRecipes.ts
│   ├── PatchRecipePayload.ts
│   ├── PostRecipePayload.ts
│   ├── Recipe.ts
│   └── ValidationError.ts
└── services
    └── RecipesService.ts

3 directories, 17 files
```

Some observation:

- A **services/RecipesService.ts** is created, the library will create a service for each crud resource we create.
- Our "input" and "output" schemas are presents under the **models/** directory.

```sh
$ cat client/models/Recipe.ts
/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Recipe = {
    id: number;
    name: string;
    description: string;
    created_at: string;
};
```

The model correctly represents our python pydantic class.

Diving into the service file we can find methods which will interact with our api:

```ts
...
    public recipesCreateRecipesPost({
        requestBody,
    }: {
        requestBody: PostRecipePayload,
    }): CancelablePromise<Recipe> {
...
```

### Play with it

Let's initialize a client pointing to our running http api:

```ts
import { FoodyClient } from './client'

const foody = new FoodyClient({
  BASE: 'http://127.0.0.1:8000'
})

async function main() {
  const res = await foody.recipes.recipesListingRecipesGet()
  console.log(res)
}

main().then(() => console.log('script done !'))
```

And finally run it:

```sh
$ npx ts-node index.ts
{
  recipes: [
    {
      id: 1,
      name: 'Lemon tart',
      description: 'A lemon tart (French: tarte au citron) is a dessert dish, a variety of tart. It has a pastry shell with a lemon flavored filling.',
      created_at: '2024-01-13T11:03:22.971236'
    }
  ],
  total: 1
}
script done !
```

## Enhance Package Generation

You may have notice but methods are pretty "complete" :
- `recipesListingRecipesGet`
- `recipesRetrieveRecipesRecipeIdGet`
- ...

The library based its methods generation on the operation id from the openapi.json and apply a "TS" normalization:
- `recipes_delete_recipes__recipe_id__patch` ⇒ `recipesUpdatedRecipesRecipeIdPatch`

To make generated names more readable we should work with the generation and FastAPI exposes an option which match perfectly our need ["generate_unique_id_function"](https://fastapi.tiangolo.com/reference/apirouter/?h=generate_unique_id_function#fastapi.APIRouter.include_router--example).

We choose switch the operationId over the route name (this means all methods declaring route should be unique!):

::code-group

```python [main.py]
...
from fastapi.routing import APIRoute

def _openid_unique_id_gen(route: APIRoute) -> str:
    """Generates more readable method in typescript client."""
    return route.name.replace(" ", "_")

app = FastAPI(generate_unique_id_function=_openid_unique_id_gen)
...
```

::

We also added a python script to generate **openapi.json** from app directly:

::code-group

```python [openapi.py]
import json

from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.openapi.utils import get_openapi

from main import app

print("Creating openapi.json file...")
with open("openapi.json", "w") as openapi_file:
    openapi_schema = get_openapi(
        title="My App",
        version="0.0.1",
        description="This is a very foody API",
        routes=app.routes,
    )
    json.dump(openapi_schema, openapi_file)
print("openapi.json file generated")
```

::

We can finally executed the script and check the operation id generated:

```sh
(venv) $ python openapi.json
Creating openapi.json file...
openapi.json file generated
(venv) $ cat openapi.json
...
```

The previous operationId `recipes_delete_recipes__recipe_id__patch` is transformed into `recipes_updated` and we finally get `recipesUpdated` as a client method.

There is other way to customize the operation id see [the official documentation](https://fastapi.tiangolo.com/advanced/path-operation-advanced-configuration/#path-operation-advanced-configuration).

## Automate package publishing

Depending on how your organize your projects, you may need to publish the package to use it to your frontend application. The following section show you use case in github or gitlab how to do it.

These both task launch when a tag is declared.

### Github Actions

::code-group

```yml [.github/workflows/publish.yml]
name: Publish to NPM registry
on:
  push:
    tags:
      - '*'
  # release:
  #   types: [created]

defaults:
  run:
    working-directory: ./api

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Generate openapi
        run: python openapi.py
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 18.x
          registry-url: 'https://registry.npmjs.org'
      - name: Convert OpenAPI to TS Client
        run: npx --yes openapi-typescript-codegen --input openapi.json --output clients --useOptions --name FoodyClient
      - name: Set npm version
        run: npm version ${CI_COMMIT_TAG} --no-git-tag-version
      - name: Publish package on NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

::

### Gitlab CI

::code-group

```yml [.gitlab-ci.yml]
image: python:3.12.1-slim

variables:
  PIP_CACHE_DIR: $CI_PROJECT_DIR/.cache/pip

.project-requirements:
  before_script:
    - python -V
    - pip install -e "."
  cache:
    key:
      files:
        - pyproject.toml
    paths:
      - .cache/pip

generate_openapi:
  stage: deploy
  extends: .project-requirements
  script:
    - python openapi.py
  artifacts:
    paths:
      - api/openapi.json
  only:
    - tags

publish_package:
  image: node:21.5.0-alpine
  stage: .post
  script:
    - npx --yes openapi-typescript-codegen --input openapi.json --output clients --useOptions --name FoodyClient
    - npm version ${CI_COMMIT_TAG} --no-git-tag-version
    - NPM_PACKAGE_NAME=$(node -p "require('./package.json').name")
    - NPM_PACKAGE_VERSION=$(node -p "require('./package.json').version")
    - |
      {
        npm publish &&
        echo "Successfully published version ${NPM_PACKAGE_VERSION} of ${NPM_PACKAGE_NAME} to NPM registry"
      } || {
        echo "No new version of ${NPM_PACKAGE_NAME} published. This is most likely because version ${NPM_PACKAGE_VERSION} already exists in NPM registry."; exit 1
      }
  only:
    - tags
```

::
