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
  const [code , setCode] = useState('print("Hello World")\n\rimport better\n\rint(str(input("This is nice")))\x7F');
  const [rightBar, setRightBar] = useState(0)
  const [showNonPrintable, setShowNonPrintable] = useState(false)

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
      // let element = document.getElementById(i.toString());
      // if(element!.innerText.charCodeAt(0) < 32 || element!.innerText.charCodeAt(0) === 127) {
      //   let newchild = ReplaceNonPrintableChar(element!.innerText);
      // }


    }
    return 
  })

  return (
    <>
      <LeftBar />
      <Code  code={code} showNonPrintable={showNonPrintable}/>
      <RightBar currentChar={currentChar} rightBar={rightBar} setShowNonPrintable={setShowNonPrintable} />
      <VeryRightBar rightBar={rightBar} setRightBar={setRightBar}/>
    </>
  )
}

function Code(props: { code : string , showNonPrintable : boolean}) {
  return (
    <div className="code-container">
      <Highlight className="python">
        {WrapEveryChracterinSpan(props.code,props.showNonPrintable)}
      </Highlight>
    </div>
  )
}



function WrapEveryChracterinSpan(code: string, showNonPrintable : boolean) {
  return code.split('').map((char, index) => {
    if(showNonPrintable && ( char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
      return ReplaceNonPrintableChar(char,index.toString());
    }
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
function RightBar(props : {currentChar : string, rightBar : number,setShowNonPrintable : React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <>
    { props.rightBar === 0 &&

      <div className="right-bar">
        <h1 className='color2'>Character Details</h1>
        {props.currentChar === "" ? <p>Click a character to see it's value</p> : 
          <>
            {props.currentChar.charCodeAt(0) < 32 || props.currentChar.charCodeAt(0) === 127 ? 
                <h2 className='char-dis color1'>{ReturnNonPrintableCharacterSymbol(props.currentChar)}</h2>
                :
                <h2 className='char-dis color1'>{props.currentChar}</h2>


              }
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
            <h1 className='color2'>Settings</h1>
            <input type='checkbox' id='show-non-printable' defaultChecked={true} onChange={(e) => {props.setShowNonPrintable(e.target.checked)}} />
      </div>

      }
    {
        props.rightBar === 3 &&
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
      <div className={'icon' + (props.rightBar === 3 ? ' active' :  '')} onClick={() => props.setRightBar(3)}></div>
    </div>
  )
}

function Seperator() {
  return (
    <div className="seperator"> </div>
  )
}

function NonPrintableCharacter(props : {char : string, id : string}) {
  return (
    <>
    <Seperator/>
    <span id={props.id} className="non-printable-character character">
      {props.char}
    </span>
    <Seperator/>
    { props.char === 'LF' && <br/>}
    </>

  )
}

function ReplaceNonPrintableChar(char : string,id : string) {
  let charCode = char.charCodeAt(0);
  switch(charCode) {
    case 0:
      return <NonPrintableCharacter char='NUL' id={id}/>
    case 1:
      return <NonPrintableCharacter char='SOH' id={id}/>
    case 2:
      return <NonPrintableCharacter char='STX' id={id}/>
    case 3:
      return <NonPrintableCharacter char='ETX' id={id}/>
    case 4:
      return <NonPrintableCharacter char='EOT' id={id}/>
    case 5:
      return <NonPrintableCharacter char='ENQ' id={id}/>
    case 6:
      return <NonPrintableCharacter char='ACK' id={id}/>
    case 7:
      return <NonPrintableCharacter char='BEL' id={id}/>
    case 8:
      return <NonPrintableCharacter char='BS' id={id}/>
    case 9:
      return <NonPrintableCharacter char='TAB' id={id}/>
    case 10:
      return <NonPrintableCharacter char='LF' id={id}/>
    case 11:
      return <NonPrintableCharacter char='VT' id={id}/>
    case 12:
      return <NonPrintableCharacter char='FF' id={id}/>
    case 13:
      return <NonPrintableCharacter char='CR' id={id}/>
    case 14:
      return <NonPrintableCharacter char='SO' id={id}/>
    case 15:
      return <NonPrintableCharacter char='SI' id={id}/>
    case 16:
      return <NonPrintableCharacter char='DLE' id={id}/>
    case 17:
      return <NonPrintableCharacter char='DC1' id={id}/>
    case 18:
      return <NonPrintableCharacter char='DC2' id={id}/>
    case 19:
      return <NonPrintableCharacter char='DC3' id={id}/>
    case 20:
      return <NonPrintableCharacter char='DC4' id={id}/>
    case 21:
      return <NonPrintableCharacter char='NAK' id={id}/>
    case 22:
      return <NonPrintableCharacter char='SYN' id={id}/>
    case 23:
      return <NonPrintableCharacter char='ETB' id={id}/>
    case 24:
      return <NonPrintableCharacter char='CAN' id={id}/>
    case 25:
      return <NonPrintableCharacter char='EM' id={id}/>
    case 26:
      return <NonPrintableCharacter char='SUB' id={id}/>
    case 27:
      return <NonPrintableCharacter char='ESC' id={id}/>
    case 28:
      return <NonPrintableCharacter char='FS' id={id}/>
    case 29:
      return <NonPrintableCharacter char='GS' id={id}/>
    case 30:
      return <NonPrintableCharacter char='RS' id={id}/>
    case 31:
      return <NonPrintableCharacter char='US' id={id}/>
    case 127:
      return <NonPrintableCharacter char='DEL' id={id}/>
  }
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
export default App

