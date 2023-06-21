import { useEffect, useState } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';
import axios from 'axios';

const stil = {
  background: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    gap: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  textArea: {
    maxHeight: "40vh",
    minHeight: "40vh",
    minWidth: "90vw"
  }
}
let webSocket = null;

function App() {

  const [metin, setMetin] = useState('');

  useEffect(() => {
    let url = new URL(window.location.href);
    let notID = url.pathname.replace('/', '');
    if (notID) {
      axios.get('http://localhost:8999/notlar/' + notID)
        .then(cevap => {
          setMetin(cevap.data)
          wsBaglan();
        })
        .catch(hata => {
          window.history.pushState('page', 'Title', `/`);
        })
    }
  }, []);

  function wsBaglan() {
    let url = new URL(window.location.href)
    let wsURL = `ws://${url.hostname}:8999${url.pathname}`
    webSocket = new WebSocket(wsURL);
    webSocket.onmessage = (e) => {
      setMetin(e.data)
    }
    webSocket.onclose = () => {
      alert('kapandı')
    }
  }

  function gonder() {

    let url = new URL(window.location.href);
    let notID = url.pathname.replace('/', '');
    if (notID) {

      webSocket.send(`01${notID}${metin}`);
    } else {
      axios.post('http://localhost:8999/notlar', new URLSearchParams({ metin }))
        .then(cevap => {
          let notID = cevap.data;
          if (notID) {
            window.history.pushState('page', 'Title', `/${notID}`);
            wsBaglan();
          }
        })
        .catch(hata => {
          alert(hata.message);
        })
    }
  }

  return (
    <div style={stil.background}>
      <Form>
        <TextArea value={metin} onChange={(e, d) => setMetin(d.value)} style={stil.textArea} placeholder='Tell us more' />
      </Form>
      <Button onClick={gonder} color='green' size='huge'>Kaydet</Button>
    </div>
  );
}

export default App;
