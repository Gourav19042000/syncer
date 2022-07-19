import React, { useState, useRef, useEffect } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';





const Editorpage = () => {
  const location = useLocation();
  const { roomId } = useParams();
  const ENDPOINT = "http://localhost:5000";
  const [clients, setClients] = useState([]);

  var socket;
  const socketRef = useRef(null);
  const reactNavigator = useNavigate();

  useEffect(() => {
    socket = io(ENDPOINT);
    const init = async () => {

      socketRef.current = await initSocket();
      socket.on('connect_error', (err) => handleErrors(err));
      socket.on('connect_failed', (err) => handleErrors(err));



      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socket.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
      })

      // Listening for joined event
      socket.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          // socketRef.current.emit(ACTIONS.SYNC_CODE, {
          //   code: codeRef.current,
          //   socketId,
          // });
        }
      );

      // Listening for disconnected
      socket.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        });


    };
    init();
    return () => {
      socket.disconnect();
      socket.off(ACTIONS.JOINED);
      socket.off(ACTIONS.DISCONNECTED);

    }
  }, []);
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }





  if (!location.state) {
    return <Navigate to="/" />;
  }

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
          &nbsp;
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
        <button className="button-3" onClick={copyRoomId}
        >
          Copy ROOM ID
        </button>
        <button className="button-24" onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socket={socket}
          roomId={roomId}
        // onCodeChange={(code) => {
        //   codeRef.current = code;
        // }}
        />
      </div>
    </div>
  );
};

export default Editorpage