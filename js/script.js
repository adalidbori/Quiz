//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const titleSpan = document.querySelector(".info-title span");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const input_exam = document.getElementById("input_exam_id");

//const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

let questionsApi = 0;
const apiKey = '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';
const endpoint = 'https://api.openai.com/v1/chat/completions';


  const loadingOverlay = document.getElementById("loading-overlay");
  const loadingIndicator = document.getElementById("loading-indicator");
  let loadingMessage = document.getElementById("loading-message");
// if startQuiz button clicked
start_btn.onclick = () => {
    let query = input_exam.value;
    const requestData = {
        model: "gpt-3.5-turbo",
        messages: [{
                role: "user", 
                content: `Create a multiple choice exam with 15 questions about ${query}. Each question must have 4 possible answers, and one of them must be correct. It also includes a brief explanation of why the answer is correct or not. Some of the questions must raise some situation or context to validate the participant's decision making. Make sure the exam structure is in JSON format like this:{'exam_name':'example name' [{'question':'example question''options': [{answer:'example answer' correct: true/ false, explanation: 'example explanation' }, answer: correct: true/falseexplanation: }]}. Finally everything must be in English`
            }
        ]
  };
    loadingOverlay.style.display = "block";
    loadingIndicator.style.display = "block";
    info_box.classList.add("activeInfo"); //show info box
    // Inicializa un contador para los puntos suspensivos
    let dotCount = 0;

    // Función para actualizar el mensaje con puntos suspensivos animados
    const updateLoadingMessage = () => {
        loadingMessage.textContent = `Creating exam. Estimated time 1 minute${'.'.repeat(dotCount)}`;
        dotCount = (dotCount + 1) % 4; // Ciclo de 3 puntos suspensivos
    };

    // Actualiza el mensaje cada 500 ms (medio segundo)
    const animationInterval = setInterval(updateLoadingMessage, 500);


    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
    })
        .then(response => {
            clearInterval(animationInterval);
            loadingOverlay.style.display = "none";
            loadingIndicator.style.display = "none";
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes trabajar con los datos JSON cargados, por ejemplo, imprimirlos en la consola
            parseData = JSON.parse(data.choices[0].message.content);
            console.log(parseData);
            return parseData;
        })
        .then(result => {
            questionsApi = result.questions.length;
            titulo = result.exam_name;
            titleSpan.textContent = titulo;
            queCounter(que_numb);
            questions = result.questions;
        })
        .catch(error => {
            clearInterval(animationInterval);
            loadingOverlay.style.display = "none";
            loadingIndicator.style.display = "none";
            console.error('Hubo un error:', error);
        });
}



// if exitQuiz button clicked
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //hide info box
}

// if continueQuiz button clicked
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.add("activeQuiz"); //show quiz box
    showQuetions(0); //calling showQestions function
    //queCounter(1); //passing 1 parameter to queCounter
    //startTimer(15); //calling startTimer function
    //startTimerLine(0); //calling startTimerLine function
}

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    //startTimer(timeValue); //calling startTimer function
    //startTimerLine(widthValue); //calling startTimerLine function
    //timeText.textContent = "Time Left"; //change the text of timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
}

// if quitQuiz button clicked
quit_quiz.onclick = () => {
    window.location.reload(); //reload the current window
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
    if (que_count < questionsApi - 1) { //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuetions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        //startTimer(timeValue); //calling startTimer function
        //startTimerLine(widthValue); //calling startTimerLine function
        //timeText.textContent = "Time Left"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    } else {
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
}

// getting questions and options from array
function showQuetions(index) {
    const que_text = document.querySelector(".que_text");

    //Obtener las question y las options desde la api
    let que_tag = '<span>'+ questions[index].question + '</span>';
    let option_tag  = "";
    for(let i=0; i < questions[index].options.length; i++){
        option_tag += '<div class="option"><span>' + questions[index].options[i].answer + '</span></div>';
    }
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag

    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for (i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", `optionSelected(${questions[index].options[i].correct}, this, ${JSON.stringify(questions[index].options)})`);
    }
}
    // creating the new div tags which for icons
    // let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
    // let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(correctaOno, answer, options) {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    //let userAns = answer.textContent; //getting user selected option
    //let correcAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items

    if (correctaOno) { //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        //answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
        
    } else {
        answer.classList.add("incorrect"); //adding red color to correct selected option
        //answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
        

        for (i = 0; i < options.length; i++) {
            if (options[i].correct) { //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                //option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                
            }
        }
    }
    console.log(options)
    for (i = 0; i < allOptions; i++) {
        //option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
        /* <div class="top">
        <h3>Lorem Ipsum</h3>
        <p>Dolor sit amet, consectetur adipiscing elit.</p>
        <i></i>
    </div> */
        const newdiv = document.createElement("div");
        newdiv.textContent = options[i].explanation;
        newdiv.classList.add("tooltip");
        option_list.children[i].appendChild(newdiv);
        option_list.children[i].addEventListener("mouseenter", (event) => {
            newdiv.style.display = "block";
            //newdiv.style.left = event.clientX + "px"; // Mueve el tooltip a la posición del mouse en el eje X
            newdiv.style.top = event.clientY + "px"; 
            
        });
        option_list.children[i].addEventListener("mouseleave", () => {
            newdiv.style.display = "none";
        });

    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult() {
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3) { // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>and congrats! , You got <p>' + userScore + '</p> out of <p>' + questionsApi + '</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if (userScore > 1) { // if user scored more than 1
        let scoreTag = '<span>and nice , You got <p>' + userScore + '</p> out of <p>' + questionsApi + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else { // if user scored less than 1
        let scoreTag = '<span>and sorry , You got only <p>' + userScore + '</p> out of <p>' + questionsApi + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

/* function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            let correcAns = questions[que_count].answer; //getting correct answer from array
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer
                    option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
} */

function queCounter(index) {
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>' + index + '</p> of <p>' +   questionsApi   + '</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}