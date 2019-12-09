var table = document.getElementsByClassName('mytable');
var player1 = "player1";
var player2 = "player2";
var aToiDeJouer = 1;

function partie(id) {
    var caseColor = document.getElementById(id);
    if(caseColor.innerText == "")
    {
        if (aToiDeJouer == 1){
            caseColor.innerHTML = "<img id='cercle' src=\"img/cercle.png\" width=\"150\" height=\"150\">";
            caseColor.className = "j1";
            aToiDeJouer = 2;
        }
        else {
            caseColor.innerHTML = "<img id='croix' src=\"img/croix.png\" width=\"150\" height=\"150\">";
            caseColor.className = "j2";
            aToiDeJouer = 1;
        }
    }
    victoire();
}

function getCase(id) {
    return document.getElementById("case"+id);
}

function victoire()
{
    for (var i = 1; i<9; i=i+3)
    {
        if ((getCase(i).className === "j1") && (getCase(i+1).className === "j1") && (getCase(i+2).className === "j1"))
        {
            alert(getCase(i).className+" à gagner")
        }
        else if ((getCase(i).className === "j2") && (getCase(i+1).className === "j2") && (getCase(i+2).className === "j2"))
        {
            alert(getCase(i).className+" à gagner")
        }
    }

    for (var i = 1; i<3; i++)
    {
        if ((getCase(i).className === "j1") && (getCase(i+3).className === "j1") && (getCase(i+6).className === "j1"))
        {
            alert(getCase(i).className+" à gagner")
        }
        else if ((getCase(i).className === "j2") && (getCase(i+3).className === "j2") && (getCase(i+6).className === "j2"))
        {
            alert(getCase(i).className+" à gagner")
        }
    }

    if ((getCase(1).className === "j1") && (getCase(5).className === "j1") && (getCase(9).className === "j1"))
    {
        alert(getCase(1).className+" à gagner")
    }
    else if ((getCase(1).className === "j2") && (getCase(5).className === "j2") && (getCase(9).className === "j2"))
    {
        alert(getCase(1).className+" à gagner")
    }
    else if ((getCase(3).className === "j1") && (getCase(5).className === "j1") && (getCase(7).className === "j1"))
    {
        alert(getCase(3).className+" à gagner")
    }
    else if ((getCase(3).className === "j2") && (getCase(5).className === "j2") && (getCase(7).className === "j2"))
    {
        alert(getCase(3).className+" à gagner")
    }



}


