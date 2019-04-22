import React from 'react';

const register = () => {
  fetch('/client', { method: 'POST', data:'test' }).then(data => console.log(data)).catch(err => console.log(err))
}

const App = () => {
  return <><button onClick={register}>Test</button></>
}

export default App;