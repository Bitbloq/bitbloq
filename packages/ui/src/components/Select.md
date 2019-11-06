Select is based on [react-select](https://react-select.com)

Simple select:

```js
<Select
  options={[
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 }
  ]}
  onChange={value => console.log(`Selected ${value}`)}
/>
```
