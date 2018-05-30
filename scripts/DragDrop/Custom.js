$(document).ready(function () {
    var questions = ["someone is going in your direction", "you can only use this phrase", "This is a great way to show that you were paying ", "you should also check out the FluentU ",
    "you might not know what you want", "it’s a nice gesture to offer them a ride.", "If you have a moment, I would love your thoughts on this."];
    //var questions = ["someone is going in your direction", "you can only use this phrase", "This is a great way to show that you were paying "];
    String.prototype.shuffle = function (questionNum) {
        //alert(this);
        var a = this.split(" ");
        var newArray = a.filter(function (v) { return v !== '' });
        var n = newArray.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = newArray[i];
            if (tmp != '' && tmp != ' ') {
                newArray[i] = newArray[j];
                newArray[j] = tmp;
            }
        }
        //alert(a.join(","));

        $("#dropWordsTopDiv").append("<div id='dropWordsBlankTopDiv" + questionNum + "' class='jdropwords'>");
        $("#dropWordsBlankTopDiv" + questionNum + "").append("<div id='dropWordsBlankDiv" + questionNum + "' class='blanks'>");
        $("#dropWordsBlankDiv" + questionNum + "").append("<p id='dropWordsBlankPara" + questionNum + "'>");
        $("#dropWordsBlankDiv" + questionNum).append("<ul id='dropWordsUL" + questionNum + "' class='words'>");

        for (var i = 0; i < newArray.length; i++) {
            $("#dropWordsBlankDiv" + questionNum + " #dropWordsBlankPara" + questionNum + "").append("<span class='blank' id='word-" + (i + 1) + "-" + questionNum + " placeholder='word1'></span>&nbsp;&nbsp;&nbsp;");
            $("#dropWordsUL" + questionNum).append("<li class='word' id='blank-" + (i + 1) + "-" + questionNum + "'>" + newArray[i] + "</li>");
        }
        $("#dropWordsBlankDiv" + questionNum + "").append("</p>");
        $("#dropWordsBlankTopDiv" + questionNum + "").append("</div>");
        $("#dropWordsTopDiv" + questionNum + "").append("</div><br/><br/>");

        return newArray.join(",");
    }
    for (var i = 0; i < questions.length; i++) {
        questions[i].shuffle(i + 1);
    }
    $(function () {
        $('.jdropwords').jDropWords({
            answers: "http://webserver.local/activities/jdropwords/answers.json"
        });
    });

    //alert(questions.shuffle());

    $("#SubmitBT").click(function () {

        var result = '';
        for (var i = 0; i < questions.length; i++) {
            var sentence = $("#dropWordsBlankPara" + (i + 1) + " .sentence");
            var newSentense = '';
            for (var j = 0; j < sentence.length; j++) {
                newSentense += sentence[j].innerHTML;
            }
            if (questions[i].replace(/\s/g, '') == newSentense) {
                result += 'Question ' + (i + 1) + ' is correct';
            }
            else {
                result += 'Question ' + (i + 1) + ' is wrong';
            }
            result += '\n';
        }
        alert(result);
        debugger;
    });
});


