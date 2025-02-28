import { useEffect, useState } from 'react'
import cesaocLogo from './assets/cesaoc.jpeg'
import icon1 from './assets/icon1.png'
import icon2 from './assets/icon2.png'
import icon3 from './assets/icon3.png'
import magnify from './assets/magnify.png'
import 'highlight.js/styles/atom-one-dark.css'
import { renderToStaticMarkup } from "react-dom/server"
import hljs from 'highlight.js'
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';


import '../node_modules/highlight.js/styles/atom-one-dark.css'
import './App.css'



interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userMutation: UseMutationResult<UserResponse, AxiosError<ErrorResponse>, { username: string }>;
}

interface SolvedQuestion {
  questionId: string;
  solvedAt: string;
  _id: string;
}

interface SolvedTestCase {
  testCaseId: string;
  solvedAt: string;
  _id: string;
}

interface TeamResponse {
  team: Team;
}
interface Team{
  _id: string;
  name: string;
  members: string[];
  score: number;
  solvedQuestions: SolvedQuestion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  solvedTestCases: SolvedTestCase[];
}

interface SubmitResponse {
  submission: {
    testCaseId: string;
    teamId: string;
    submittedOutput: string;
    isCorrect: boolean;
    attemptNumber: number;
    _id: string;
    createdAt: string; // Consider using Date if you plan to parse it
    updatedAt: string; // Same as above
    __v: number;
  };
}
interface UserResponse {
  user: User;
}
interface User{
  _id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  team: string;
}

interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

// interface ErrorResponse2{
//   submittedOutput: string;
// }

// interface LoginCredentials {
//   usernameOrEmail: string;
//   password: string;
// }


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentChar, setCurrentChar] = useState('');
  const [code , setCode] = useState('');
  const [rightBar, setRightBar] = useState(0)
  const [showNonPrintable, setShowNonPrintable] = useState(true)
  const [questions, setQuestions] = useState<any>([])
  const [currentQuestion , setCurrentQuestion] = useState<any>(undefined);
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState<number>(NaN);
  const [team , setTeam] = useState<string>('');
  const [veryrightAnswer, setVeryRightAnswer] = useState([0,0,0]);


  console.log(questions);
  

  useEffect(() => {
    if(localStorage.getItem('token')) {
      setLoggedIn(true)
      userMutation.mutate({username : JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).username});
    };
  },[])

  const userMutation = useMutation<UserResponse, AxiosError<ErrorResponse>, { username: string}>({
    mutationFn: async ({ username }) => {
      const response = await axios.get('https://iustcesa.ir/api/userInformation/' + username , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      teamMutation.mutate({teamid : data.user.team});
    },
    onError: () => {
      console.log("oh");
    },
  });
  const teamMutation = useMutation<TeamResponse, AxiosError<ErrorResponse>, { teamid : string}>({
    mutationFn: async ({ teamid}) => {
      const response = await axios.get('https://iustcesa.ir/api/team/' + teamid,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setTeam(data.team.name);
    },
    onError: () => {
      console.log("oh");
    },
  });

  useEffect(() => {
    if(!loggedIn) {
      return;
    }
    const codeElement = document.querySelector('code');

    if(codeElement?.dataset.highlighted)
    {
      delete codeElement?.dataset.highlighted;
    }


    hljs.highlightAll()


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

  } , [code,loggedIn])
   
  useEffect(() => {
    console.log(currentQuestion);

  } , [currentQuestion])
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

  return (
    <>
      { loggedIn ? 
        <>
          <LeftBar team={team} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} setCode={setCode} questions={questions} setQuestions={setQuestions} setCurrentQuestion={setCurrentQuestion}/>
          <Code  code={code} showNonPrintable={showNonPrintable}/>
          <RightBar setVeryRightAnswer={setVeryRightAnswer}  question={currentQuestion}  currentChar={currentChar} rightBar={rightBar} setShowNonPrintable={setShowNonPrintable} showNonPrintable={showNonPrintable}/>
          <VeryRightBar veryRightBarAnswer={veryrightAnswer} currentQuestion={currentQuestion} rightBar={rightBar} setRightBar={setRightBar}/>                                                                                                                                                                                       
      </>
      :
      <Login userMutation={userMutation} setLoggedIn={setLoggedIn}/>
        
    }
  </>
)
}

function Login({ setLoggedIn , userMutation }: LoginProps) {
const [usernameOrEmail, setUsernameOrEmail] = useState('');
const [password, setPassword] = useState('');



const loginMutation = useMutation<LoginResponse, AxiosError<ErrorResponse>, { usernameOrEmail: string; password: string }>({
  mutationFn: async ({ usernameOrEmail, password }) => {
    const response = await axios.post('https://iustcesa.ir/api/login', {
      usernameOrEmail,
      password,
    });
    return response.data;
  },
  onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      let userName = JSON.parse(atob(data.token.split('.')[1])).username;
      userMutation.mutate({username : userName});
      setLoggedIn(true);

    
  },
  onError: (error) => {
    alert(error.response?.data?.message || 'Login failed');
  },
});


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



// function WrapEveryChracterinSpan(code: string, showNonPrintable : boolean) {

//   let a = code.split('').map((char, index) => {
//     if(( char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
//       return ReplaceNonPrintableChar(char,index.toString(),showNonPrintable);
//     }
//     return <span id={index.toString()} className='character' key={index}>{char}</span>
//   })
//   return a;
// }

function LeftBar(props : {  team : string ,  currentQuestionIndex : number , setCurrentQuestionIndex : React.Dispatch<React.SetStateAction<number>> , setCurrentQuestion : React.Dispatch<React.SetStateAction<any>> , setCode : React.Dispatch<React.SetStateAction<string>> , questions : any ,  setQuestions :  React.Dispatch<React.SetStateAction<Array<any>>>}) {
const [codes, setCodes] = useState<string[]>([]); 
const [loading, setLoading] = useState<boolean>(true); 
const [error, setError] = useState<string | null>(null); 

useEffect(() => {
    const fetchCodes = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('https://iustcesa.ir/api/questions', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        
        
        const codeTitles = response.data.map((question: any) => question.title);
        setCodes(codeTitles);
        props.setQuestions(response.data)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch codes');
        console.log(err);
        
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  if (loading) {
    return <div className="left-bar">Loading...</div>;
  }

  if (error) {
    return <div className="left-bar">{error}</div>;
  }


  return (
    <div className="left-bar">
      <div className="left-bar-header">
        <img src={cesaocLogo} alt="Cesaoc Logo" width={"70"} />
        <h1>CESA OC</h1>
      </div>
      
      <h2 className='team-number'>Team {props.team}</h2>
      {/* <h2 className='team-number'>User {JSON.parse(atob(localStorage.getItem('token')?.split('.')[1]!)).username}</h2> */}
      {codes.sort().map((code, index) => (
        <h3 key={index} className={props.currentQuestionIndex === index ? "active" : ""} onClick={() => {props.setCode(atob(props.questions[index].description));props.setCurrentQuestion(props.questions[index]);props.setCurrentQuestionIndex(index)}}>Code #{code}</h3>
      ))}
    </div>
  );
}

function RightBar(props : { setVeryRightAnswer : React.Dispatch<React.SetStateAction<Array<number>>> ,question : any ,  currentChar : string, rightBar : number,setShowNonPrintable : React.Dispatch<React.SetStateAction<boolean>>  , showNonPrintable : boolean}) {
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
        (props.rightBar === 1 && props.question && props.question.testCases && props.question.testCases[0]) &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase setVeryRightAnswer={props.setVeryRightAnswer}  question={props.question} number={1}/>
          </div>

      }
      {
        (props.rightBar === 2 && props.question && props.question.testCases && props.question.testCases[1]) && 
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase  setVeryRightAnswer={props.setVeryRightAnswer} question={props.question} number={2}/>
          </div>

      }
      {
        (props.rightBar === 3 && props.question && props.question.testCases && props.question.testCases[2]) &&
          <div className="right-bar">
            <h1 className='color2'>Submit Answer</h1>
            <TestCase  setVeryRightAnswer={props.setVeryRightAnswer} question={props.question} number={3}/>
          </div>

      }
    </>
  )
}
function VeryRightBar(props : {veryRightBarAnswer : Array<number> , currentQuestion : any,rightBar : number, setRightBar : React.Dispatch<React.SetStateAction<number>>}) {
  return (
    <div className="very-right-bar">
      <div className={'icon' + (props.rightBar === 0 ? ' active' :  '')} onClick={() => props.setRightBar(0)}>
        <img src={magnify} alt="Magnify" width={50} height={50} />
      </div>
      <div className={'icon' + (props.rightBar === 1 ? ' active' :  '') + (props.currentQuestion?.testCases[0]?.hasSolved || props.veryRightBarAnswer[0] == 1 ? " correct" : "") + (props.currentQuestion?.testCases[0]?.hasSolved === false && props.currentQuestion?.testCases[0]?.canSubmit === false || props.veryRightBarAnswer[0] == 2 ? " wrong" : "")} onClick={() => props.setRightBar(1)}>
        <img src={icon1} alt="Icon 1" width={50} height={50} />
      </div>
      <div className={'icon' + (props.rightBar === 2 ? ' active' :  '') + (props.currentQuestion?.testCases[1]?.hasSolved || props.veryRightBarAnswer[1] == 1 ? " correct" : "") + (props.currentQuestion?.testCases[1]?.hasSolved === false && props.currentQuestion?.testCases[1]?.canSubmit === false || props.veryRightBarAnswer[1] == 2 ? " wrong" : "")} onClick={() => props.setRightBar(2)}>
        <img src={icon2} alt="Icon 2" width={50} height={50} />
      </div>
      <div className={'icon' + (props.rightBar === 3 ? ' active' :  '') + (props.currentQuestion?.testCases[2]?.hasSolved || props.veryRightBarAnswer[2] == 1 ? " correct" : "") + (props.currentQuestion?.testCases[1]?.hasSolved === false && props.currentQuestion?.testCases[2]?.canSubmit === false || props.veryRightBarAnswer[2] == 2 ? " wrong" : "")} onClick={() => props.setRightBar(3)}>
        <img src={icon3} alt="Icon 3" width={50} height={50} />
      </div>
    </div>
  )
}
function TestCase(props : {setVeryRightAnswer : React.Dispatch<React.SetStateAction<Array<number>>>, question : any , number : number}) {

  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const submitMutation= useMutation<SubmitResponse, AxiosError<ErrorResponse>, { testCaseId: string; submittedOutput: string }>({
    mutationFn: async ({ testCaseId, submittedOutput}) => {
      const response = await axios.post('https://iustcesa.ir/api/submit', {
        testCaseId,
        submittedOutput
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if(data.submission.isCorrect) {
        setMessage('Correct Answer');
        props.setVeryRightAnswer((prev) => prev.map((value,index) => index === props.number - 1 ? 1 : value));
      }
      else{
        setMessage('Incorrect Answer');
      }
    },
    onError: (error) => {
      if(error.status === 444) {
          props.setVeryRightAnswer((prev) => prev.map((value,index) => index === props.number - 1 ? 2 : value));
      }
      setMessage(error.response?.data?.message || 'Submission failed or empty submission');
    },
  });
  return (
    <>
      <h2>Test Case {props.number}</h2>
      <div className="test-case">
      <pre>
        <code>
            {atob(props.question.testCases[props.number - 1]?.input)}
        </code>
      </pre>
      </div>
      <br/>
      {/* <input className='answer-box' type="text" placeholder="Enter Answer" /> */}
      <textarea rows={3} onChange={(e) => {setAnswer(e.target.value)}}></textarea>
      <br/>
      <p>{message}</p>
      <button onClick={() => {submitMutation.mutate({testCaseId : props.question.testCases[props.number - 1]?._id , submittedOutput : btoa(answer)})}}>Submit</button>
      
    </>
  )
}



function Seperator() {
  return (
    <div className="seperator"> </div>
  )
}

function NonPrintableCharacter(props : {char : string}) {
  return (
    <>
    <Seperator/>
    <span className={"non-printable-character character"}>
      {props.char}
    </span>
    <Seperator/>
    { props.char === 'LF' && <br/>}
    </>

  )
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

