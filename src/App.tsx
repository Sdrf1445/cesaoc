import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cesaocLogo from './assets/cesaoc.jpeg'
import 'highlight.js/styles/atom-one-dark.css'
import { renderToStaticMarkup } from "react-dom/server"
import hljs from 'highlight.js'
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';


import '../node_modules/highlight.js/styles/atom-one-dark.css'
import './App.css'



interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentChar, setCurrentChar] = useState('');
  const [code , setCode] = useState('iIlL print("Hello World")\r\nimport better\r\nint(str(input("This is nice")))\x7F\x16');
  const [rightBar, setRightBar] = useState(0)
  const [showNonPrintable, setShowNonPrintable] = useState(false)

  useEffect(() => {
  console.log("showNonPrintable state:", showNonPrintable);
}, [showNonPrintable]);
  useEffect(() => {
  console.log("re-rendered");
  })


  useEffect(() => {
    if(localStorage.getItem('token')) {
      setLoggedIn(true)
    };

  },[])

  useEffect(() => {
    if(!loggedIn) {
      return;
    }
    hljs.highlightAll()

    const codeElement = document.querySelector('code');
    const fragment = document.createDocumentFragment();

    codeElement?.childNodes.forEach((node) => {
      if(node.nodeType === 3) {
        node.textContent?.split('').forEach((char) => {
          if(char.charCodeAt(0) === 1000) {
            let nonprintable = <NonPrintableCharacter char={"CR"}/>
            const lem = renderToStaticMarkup(nonprintable);
            const parser = new DOMParser();
            let elem = parser.parseFromString(lem, 'text/html');
            let test = Array(...elem.body.children);
            test.forEach((child) => {
              fragment.appendChild(child);
            })
            return;
          }
          if(( char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
            let nonprintable = <NonPrintableCharacter char={ReturnNonPrintableCharacterSymbol(char)!}/>
            const lem = renderToStaticMarkup(nonprintable);
            const parser = new DOMParser();
            let elem = parser.parseFromString(lem, 'text/html');
            let test = Array(...elem.body.children);
            test.forEach((child) => {
              fragment.appendChild(child);
            })
            return;
          }
          const span = document.createElement('span');
          span.classList.add('character');
          span.textContent = char;
          fragment.appendChild(span);
        })
      } else {
        let clone = fragment.appendChild(node.cloneNode(false));
        node.textContent?.split('').forEach((char) => {
          if(char.charCodeAt(0) === 1000) {
            let nonprintable = <NonPrintableCharacter char={"CR"}/>
            const lem = renderToStaticMarkup(nonprintable);
            const parser = new DOMParser();
            let elem = parser.parseFromString(lem, 'text/html');
            let test = Array(...elem.body.children);
            test.forEach((child) => {
              fragment.appendChild(child);
            })
            return;
          }
          if(( char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
            let nonprintable = <NonPrintableCharacter char={ReturnNonPrintableCharacterSymbol(char)!}/>
            const lem = renderToStaticMarkup(nonprintable);
            const parser = new DOMParser();
            let elem = parser.parseFromString(lem, 'text/html');
            let test = Array(...elem.body.children);
            test.forEach((child) => {
              fragment.appendChild(child);
            })
            return;
          }
          const span = document.createElement('span');
          span.classList.add('character');
          span.textContent = char;
          clone.appendChild(span);
        })
      }
    });
    codeElement!.innerHTML = '';
    codeElement?.appendChild(fragment);



    let elements = document.getElementsByClassName("character");
    for(let i = 0; i < elements.length; i++) {
      elements.item(i)?.addEventListener('click', () => {
        setCurrentChar(elements.item(i)!.textContent!)
      })
    }

  } , [code,showNonPrintable,loggedIn])
  // useEffect(() => {
  //   hljs.highlightAll()
  //   
  //   for(let i = 0; i < code.length; i++) {
  //     document.getElementById(i.toString())?.addEventListener('click', () => {
  //       setCurrentChar(code[i])
  //     })
  //   }
  // })
  useEffect(() => {
    console.log("currentChar state:", currentChar);
  } , [currentChar])
  useEffect(() => {
    let elemenets = document.getElementsByClassName('non-printable-character');
    for(let i = 0; i < elemenets.length; i++) {
      elemenets.item(i)?.classList.toggle('hidden');
    }
    elemenets = document.getElementsByClassName('seperator');
    for(let i = 0; i < elemenets.length; i++) {
      elemenets.item(i)?.classList.toggle('hidden');
    }
  } , [showNonPrintable]);
  useEffect(() => {
    // fetch('http://0.0.0.0:8000/new.py').then((response) => response.text()).then((data) => {console.log(data); setCode(data)})
  },[])

  return (
    <>
      { loggedIn ? 
        <>
          <LeftBar />
          <Code  code={code} showNonPrintable={showNonPrintable}/>
          <RightBar currentChar={currentChar} rightBar={rightBar} setShowNonPrintable={setShowNonPrintable} showNonPrintable={showNonPrintable}/>
          <VeryRightBar rightBar={rightBar} setRightBar={setRightBar}/>                                                                                                                                                                                       
        </>
        :
        <Login setLoggedIn={setLoggedIn}/>
      }
    </>
  )
}

function Login({ setLoggedIn }: LoginProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation<LoginResponse, AxiosError<ErrorResponse>, { usernameOrEmail: string; password: string }>({
    mutationFn: async ({ usernameOrEmail, password }) => {
      const response = await axios.post('http://localhost:8000/api/login', {
        usernameOrEmail,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setLoggedIn(true);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Login failed');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      alert('Please enter both username/email and password');
      return;
    }
    loginMutation.mutate({ usernameOrEmail, password });
  };

  return (
    <div className='main'>
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => loginMutation.mutate({ usernameOrEmail, password })} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}


function Code(props: { code : string , showNonPrintable : boolean}) {

  return (
    <div className="code-container">
      <pre>
        <code className="python">
          {/* {...WrapEveryChracterinSpan(props.code,props.showNonPrintable)} */}
          {props.code.replaceAll('\r', String.fromCharCode(1000))}
        </code>
      </pre>

    </div>
  )
}



function WrapEveryChracterinSpan(code: string, showNonPrintable : boolean) {

  let a = code.split('').map((char, index) => {
    if(( char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
      return ReplaceNonPrintableChar(char,index.toString(),showNonPrintable);
    }
    return <span id={index.toString()} className='character' key={index}>{char}</span>
  })
  return a;
}

function LeftBar() {
  return (
    <div className="left-bar">
      <div className="left-bar-header">
        <img src={cesaocLogo} alt="Cesaoc Logo" width={"70"}/>
        <h1> CESA OC </h1>
      </div>
      <h2 className='team-number'>Team 4</h2>
      <h3 className='encoded'>Code #1</h3>
      <h3 className='encoded'>Code #1</h3>
      <h3 className='encoded'>Code #1</h3>
      <h3 className='encoded'>Code #1</h3>
      <h3 className='encoded'>Code #1</h3>
    </div>
  )
}
function RightBar(props : {currentChar : string, rightBar : number,setShowNonPrintable : React.Dispatch<React.SetStateAction<boolean>>  , showNonPrintable : boolean}) {
  return (
    <>
      { props.rightBar === 0 &&

        <div className="right-bar">
          <h1 className='color2'>Character Details</h1>
          {props.currentChar === "" ? <p>Click a character to see it's value</p> : 
            <>
              {/* {props.currentChar.charCodeAt(0) < 32 || props.currentChar.charCodeAt(0) === 127 ?  */}
              {/*   <h2 className='char-dis color1'>{ReturnNonPrintableCharacterSymbol(props.currentChar)}</h2> */}
              {/*   : */}
              {/*   <h2 className='char-dis color1'>{props.currentChar}</h2> */}


              {/* } */}
              
              <h2 className='char-dis color1'>{props.currentChar}</h2>
              {props.currentChar.length > 1 ? 
                <>
                  <p className='color3'>ASCII Value : {ReturnASCIIFromSYMBOL(props.currentChar)}</p>
                  <p className='color3'> Binary Value : {ReturnASCIIFromSYMBOL(props.currentChar)!.toString(2)}</p>
                  <p className='color3'> Hex Value : {ReturnASCIIFromSYMBOL(props.currentChar)!.toString(16).toString().toUpperCase()}</p>
                </>
                  :
                <>
                  <p className='color3'>ASCII Value : {props.currentChar.charCodeAt(0)}</p>
                  <p className='color3'> Binary Value : {props.currentChar.charCodeAt(0).toString(2)}</p>
                  <p className='color3'> Hex Value : {props.currentChar.charCodeAt(0).toString(16).toString().toUpperCase()}</p>
                </>


              }


            </>
          }

          <div>
            <input type='checkbox' id='show-non-printable' checked={props.showNonPrintable}  onChange={(e) => {props.setShowNonPrintable(e.target.checked)}}  />
            <label htmlFor='show-non-printable'>Show non-printable characters</label>
          </div>
        </div>
      }
      {
        props.rightBar === 1 &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase input={"5\n1\n5\n5"} number={1}/>
          </div>

      }
      {
        props.rightBar === 2 &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase input="print('Hello World')" number={2}/>
          </div>

      }
      {
        props.rightBar === 3 &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase input="print('Hello World')" number={3}/>
          </div>

      }
      {
        props.rightBar === 4 &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase input="print('Hello World')" number={4}/>
          </div>

      }
      {
        props.rightBar === 5 &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase input="print('Hello World')" number={5}/>
          </div>

      }
    </>
  )
}
function VeryRightBar(props : {rightBar : number, setRightBar : React.Dispatch<React.SetStateAction<number>>}) {
  return (
    <div className="very-right-bar">
      <div className={'icon' + (props.rightBar === 0 ? ' active' :  '')} onClick={() => props.setRightBar(0)}></div>
      <div className={'icon' + (props.rightBar === 1 ? ' active' :  '')} onClick={() => props.setRightBar(1)}></div>
      <div className={'icon' + (props.rightBar === 2 ? ' active' :  '')} onClick={() => props.setRightBar(2)}></div>
      <div className={'icon' + (props.rightBar === 3 ? ' active' :  '')} onClick={() => props.setRightBar(3)}></div>
      <div className={'icon' + (props.rightBar === 4 ? ' active' :  '')} onClick={() => props.setRightBar(4)}></div>
      <div className={'icon' + (props.rightBar === 5 ? ' active' :  '')} onClick={() => props.setRightBar(5)}></div>
    </div>
  )
}
function TestCase(props : {input : string , number : number}) {
  return (
    <>
      <h2>Test Case {props.number}</h2>
      <div className="test-case">
      <pre>
        <code>
          {props.input}
        </code>
      </pre>
      </div>
      <br/>
      {/* <input className='answer-box' type="text" placeholder="Enter Answer" /> */}
      <textarea rows={3}></textarea>
      <br/>
      <button>Submit</button>
      
    </>
  )
}

function Seperator() {
  return (
    <div className="seperator hidden"> </div>
  )
}

function NonPrintableCharacter(props : {char : string}) {
  return (
    <>
    <Seperator/>
    <span className={"non-printable-character character hidden"}>
      {props.char}
    </span>
    <Seperator/>
    { props.char === 'LF' && <br/>}
    </>

  )
}

function ReplaceNonPrintableChar(char : string) {
  return <NonPrintableCharacter char={ReturnNonPrintableCharacterSymbol(char)!}  />
}
function ReturnNonPrintableCharacterSymbol(char : string) {
  let charCode = char.charCodeAt(0);
  switch(charCode) {
    case 0:
      return 'NUL'
    case 1:
      return 'SOH'
    case 2:
      return 'STX'
    case 3:
      return 'ETX'
    case 4:
      return 'EOT'
    case 5:
      return 'ENQ'
    case 6:
      return 'ACK'
    case 7:
      return 'BEL'
    case 8:
      return 'BS'
    case 9:
      return 'TAB'
    case 10:
      return 'LF'
    case 11:
      return 'VT'
    case 12:
      return 'FF'
    case 13:
      return 'CR'
    case 14:
      return 'SO'
    case 15:
      return 'SI'
    case 16:
      return 'DLE'
    case 17:
      return 'DC1'
    case 18:
      return 'DC2'
    case 19:
      return 'DC3'
    case 20:
      return 'DC4'
    case 21:
      return 'NAK'
    case 22:
      return 'SYN'
    case 23:
      return 'ETB'
    case 24:
      return 'CAN'
    case 25:
      return 'EM'
    case 26:
      return 'SUB'
    case 27:
      return 'ESC'
    case 28:
      return 'FS'
    case 29:
      return 'GS'
    case 30:
      return 'RS'
    case 31:
      return 'US'
    case 127:
      return 'DEL'
  }

}

function ReturnASCIIFromSYMBOL(symbol : string) {
  switch(symbol) {
    case 'NUL':
      return 0
    case 'SOH':
      return 1
    case 'STX':
      return 2
    case 'ETX':
      return 3
    case 'EOT':
      return 4
    case 'ENQ':
      return 5
    case 'ACK':
      return 6
    case 'BEL':
      return 7
    case 'BS':
      return 8
    case 'TAB':
      return 9
    case 'LF':
      return 10
    case 'VT':
      return 11
    case 'FF':
      return 12
    case 'CR':
      return 13
    case 'SO':
      return 14
    case 'SI':
      return 15
    case 'DLE':
      return 16
    case 'DC1':
      return 17
    case 'DC2':
      return 18
    case 'DC3':
      return 19
    case 'DC4':
      return 20
    case 'NAK':
      return 21
    case 'SYN':
      return 22
    case 'ETB':
      return 23
    case 'CAN':
      return 24
    case 'EM':
      return 25
    case 'SUB':
      return 26
    case 'ESC':
      return 27
    case 'FS':
      return 28
    case 'GS':
      return 29
    case 'RS':
      return 30
    case 'US':
      return 31
    case 'DEL':
      return 127
  }
}
export default App

