
function Seperator() {
  return (
    <div className="seperator"> </div>
  )
}
function NonPrintableCharacter(props : {char : string, id : string , showNonPrintable : boolean}) {
  return (
    <>
    <Seperator/>
    <span id={props.id} className={"non-printable-character character" + (props.showNonPrintable ? " hidden" : "") }>
      {props.char}
    </span>
    <Seperator/>
    { props.char === 'LF' && <br/>}
    </>

  )
}

function ReplaceNonPrintableChar(char : string,id : string , showNonPrintable : boolean) {
  return <NonPrintableCharacter char={ReturnNonPrintableCharacterSymbol(char)!} id={id} showNonPrintable={showNonPrintable}/>
}
