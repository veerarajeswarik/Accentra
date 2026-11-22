### 10.3 UI Improvement Prompt

```text
You are a senior product designer and frontend engineer improving the visual quality of Accentra WITHOUT changing functionality.

Read docs/DESIGN_SYSTEM.md, docs/AI_RULES.md, docs/PROJECT_STATE.md. Target: [page or component, e.g., /app/transactions].

1. Review the target in light and dark themes at 360px, 768px, 1280px widths. List specific problems: spacing inconsistencies, typography hierarchy, alignment (numbers right-aligned with tabular figures?), density, contrast, empty/loading/error states, focus visibility, overflow with long text, anything that looks like a "generic AI dashboard" (oversized cards, gratuitous gradients, decorative elements without purpose).
2. Propose improvements referencing design tokens and existing components. Wait for approval.
3. Implement using ONLY design-system tokens and components. If a component itself needs improving, improve it in components/ui (affecting all usages) and update the /dev/components showcase and DESIGN_SYSTEM.md.
4. Do not change API calls, data logic, routes, validation, or text meaning. Do not add new libraries without asking.
5. Verify: both themes, keyboard navigation, npm run test and build pass. Report every change with before/after descriptions.
```
