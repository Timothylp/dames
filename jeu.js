const [VIDE, BLANC, NOIR] = [0, 1, 2];
const departPlateau = [
  [VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR],
  [NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE],
  [VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR],
  [NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE, NOIR, VIDE],
  [VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE],
  [VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE, VIDE],
  [VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC],
  [BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE],
  [VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC],
  [BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE, BLANC, VIDE],
];
const PION_BLANC = "<div class='pion blanc'></div>";
const PION_NOIR = "<div class='pion noir'></div>";

const jeuDOM = document.getElementById("jeu");
let plateau = [];

let caseSelectionnee = null;

init();

function init() {
  // Initialise le plateau de jeu
  plateau = new Array(10);
  for (let i = 0; i < 10; i++) {
    plateau[i] = new Array(10);
  }

  // Initialise les cases du plateau de jeu
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      plateau[i][j] = VIDE;
    }
  }

  // Affiche le plateau et les pions
  jeuDOM.appendChild(creerPlateau());
  ajouterPions();

  // Ajoute un événement au clic pour chaque cases
  const cases = document.getElementsByClassName("case noire");
  for (let i = 0; i < cases.length; i++) {
    cases[i].addEventListener("click", () => jouer(cases[i]));
  }
}

function jouer(suivCase) {
  if (suivCase.querySelector(".pion") !== null) {
    let posY = parseInt(suivCase.id.split("-")[0]);
    let posX = parseInt(suivCase.id.split("-")[1]);
    let couleur = plateau[posY][posX];

    console.log(posY, posX);
    let coups = coupsPotentiels(posY, posX, couleur);

    if (coups.length) {
      console.log(coups);
      if (caseSelectionnee !== null) {
        caseSelectionnee.classList.remove("selectionnee");
      }
      caseSelectionnee = suivCase;
      caseSelectionnee.classList.add("selectionnee");

      cacherCoupsPotentiels();

      coups.forEach((coup) => {
        let coupDOM = document.getElementById(coup[0] + "-" + coup[1]);

        if (coupDOM) {
          coupDOM.classList.add("potentiel");
          coupDOM.addEventListener("click", () => deplacerPion(coupDOM));
        }
      });
    }
  }
}

function deplacerPion(coup) {
  if (caseSelectionnee !== null) {
    if (coup.querySelector(".pion") === null) {
      let coupY = parseInt(coup.id.split("-")[0]);
      let coupX = parseInt(coup.id.split("-")[1]);
      let couleur =
        plateau[caseSelectionnee.id.split("-")[0]][
          caseSelectionnee.id.split("-")[1]
        ];

      plateau[caseSelectionnee.id.split("-")[0]][
        caseSelectionnee.id.split("-")[1]
      ] = VIDE;

      caseSelectionnee.innerHTML = "";
      caseSelectionnee.classList.remove("selectionnee");
      caseSelectionnee = null;

      plateau[coupY][coupX] = couleur;

      if (couleur === BLANC) {
        coup.innerHTML = PION_BLANC;
      } else {
        coup.innerHTML = PION_NOIR;
      }

      cacherCoupsPotentiels();
    }
  }
}

function coupsPotentiels(posY, posX, couleur) {
  let coups = [];

  if (couleur === BLANC) {
    let diagGauche = [posY - 1, posX - 1];
    let diagDroite = [posY - 1, posX + 1];

    if (posY - 1 >= 0) {
      if (posX + 1 <= 10) {
        if (plateau[diagDroite[0]][diagDroite[1]] === VIDE) {
          coups.push(diagDroite);
        }
      }

      if (posX - 1 >= 0) {
        if (plateau[diagGauche[0]][diagGauche[1]] === VIDE) {
          coups.push(diagGauche);
        }
      }
    }
  } else {
    let diagGauche = [posY + 1, posX - 1];
    let diagDroite = [posY + 1, posX + 1];

    if (posY + 1 <= 10) {
      if (posX + 1 <= 10) {
        if (plateau[diagDroite[0]][diagDroite[1]] === VIDE) {
          coups.push(diagDroite);
        }
      }

      if (posX - 1 >= 0) {
        if (plateau[diagGauche[0]][diagGauche[1]] === VIDE) {
          coups.push(diagGauche);
        }
      }
    }
  }

  return coups;
}

function cacherCoupsPotentiels() {
  document.querySelectorAll(".potentiel").forEach((potentiel) => {
    potentiel.classList.remove("potentiel");
  });
}

function creerPlateau() {
  let tableau = document.createElement("table");
  tableau.setAttribute("id", "plateau");
  for (let i = 0; i < 10; i++) {
    let ligne = document.createElement("tr");
    for (let j = 0; j < 10; j++) {
      let caseDOM = document.createElement("td");
      caseDOM.setAttribute("id", i + "-" + j);

      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
        caseDOM.setAttribute("class", "case blanche");
      } else if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0)) {
        caseDOM.setAttribute("class", "case noire");
      }

      ligne.appendChild(caseDOM);
    }
    tableau.appendChild(ligne);
  }

  return tableau;
}

function ajouterPions() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (departPlateau[i][j] == BLANC) {
        plateau[i][j] = BLANC;
        document.getElementById(i + "-" + j).innerHTML = PION_BLANC;
      } else if (departPlateau[i][j] == NOIR) {
        plateau[i][j] = NOIR;
        document.getElementById(i + "-" + j).innerHTML = PION_NOIR;
      }
    }
  }
}
