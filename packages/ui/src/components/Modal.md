Example modal

```jsx
initialState = { isOpen: false };
<div>
  <Button onClick={() => setState({ isOpen: true })}>Open</Button>
  <Modal
    isOpen={state.isOpen}
    title="Hello!"
    onClose={() => setState({ isOpen: false })}
  >
    <div style={{ padding: "40px", width: "100px" }}>
      <Button onClick={() => setState({ isOpen: false })}>Close</Button>
    </div>
  </Modal>
</div>;
```
