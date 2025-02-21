import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cesaocLogo from './assets/cesaoc.jpeg'
import Highlight from 'react-highlight'
import '../node_modules/highlight.js/styles/atom-one-dark.css'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentChar, setCurrentChar] = useState('');
  const [code , setCode] = useState('print("Hello World")\nimport better\nint(str(input("This is nice")))');
  const [rightBar, setRightBar] = useState(0)

  useEffect(() => {
    if(localStorage.getItem('token')) {
      setLoggedIn(true)
    };

  },[])

  useEffect(() => {
    for(let i = 0; i < code.length; i++) {

      document.getElementById(i.toString())?.addEventListener('click', () => {
        setCurrentChar(code[i])
      })
    }
    return 
  })

  return (
    <>
      <LeftBar />
      <Code setCurrentChar={setCurrentChar} code={code}/>
      <RightBar currentChar={currentChar} rightBar={rightBar}/>
      <VeryRightBar rightBar={rightBar} setRightBar={setRightBar}/>
    </>
  )
}

function Code(props: { code : string , setCurrentChar : React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <div className="code-container">
      <Highlight className="python">
        {WrapEveryChracterinSpan(props.code , props.setCurrentChar)}
      </Highlight>
    </div>
  )
}



function WrapEveryChracterinSpan(code: string, setCurrentChar : React.Dispatch<React.SetStateAction<string>>) {
  return code.split('').map((char, index) => {
    return <span id={index.toString()} className='character' key={index}>{char}</span>
  })
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
function RightBar(props : {currentChar : string, rightBar : number}) {
  return (
    <>
    { props.rightBar === 0 &&

      <div className="right-bar">
        <h1 className='color2'>Character Details</h1>
        {props.currentChar === "" ? <p>Click a character to see it's value</p> : 
          <>
            <h2 className='char-dis color1'>{props.currentChar}</h2>
            <p className='color3'>ASCII Value : {props.currentChar.charCodeAt(0)}</p>
            <p className='color3'> Binary Value : {props.currentChar.charCodeAt(0).toString(2)}</p>
            <p className='color3'> Hex Value : {props.currentChar.charCodeAt(0).toString(16).toString().toUpperCase()}</p>

          </>
        }
      </div>
    }
    {
        props.rightBar === 1 &&
      <div className="right-bar">
            <h1 className='color2'>ASCII Table</h1>

      </div>

      }
    {
        props.rightBar === 2 &&
      <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <input type="text" placeholder="Enter Answer" />

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
    </div>
  )
}
export default App

