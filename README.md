# vite-dynamic-form

A modularized and strongly-typed form implementation which is backwards-compatible with old data, running local migrations to ensure data integrity.

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/vitejs-vite-gqcg3d)

## Important Files

- File schema and what is included in a schema definition -> https://github.com/Jugbot/vite-dynamic-form/blob/main/src/components/ExampleComponent/schema/v0.ts
- Latest schema and how to add a new version -> https://github.com/Jugbot/vite-dynamic-form/blob/main/src/components/ExampleComponent/schema/latest.ts
- Important types -> https://github.com/Jugbot/vite-dynamic-form/blob/main/src/types.ts
- Module directory (how we look up a module using an id) -> https://github.com/Jugbot/vite-dynamic-form/blob/main/src/components/modules.ts

### Form Components:
- Example Component -- simple component that clearly demonstrates basic form behavior
- Parent Component -- more compplicated component that shows how to nest form components inside one another
- Slot Component -- the most advanced component that dynamically hosts different children

## Important Mentions

- We determine global form state such as "Should the submit button be enabled" by defining a special key `_type` and recursively searching for errors in the form state tree. There are probably better ways to do this but *premature optimization is the root of all evil*
