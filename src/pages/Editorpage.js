import React, { useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import './Editorpage.css';
const Editorpage = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: 'Gourav' },
    { socketId: 2, username: 'look' },
    { socketId: 2, username: 'look' }
  ]);
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              className="logoImage"
              src="/img1.png"
              alt="logo"
            />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button className="button-3" //onClick={copyRoomId}
        >
          Copy ROOM ID
        </button>
        <button className="button-24" //onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
        // socketRef={socketRef}
        // roomId={roomId}
        // onCodeChange={(code) => {
        //   codeRef.current = code;
        // }}
        />
      </div>
    </div>
  );
};

export default Editorpage