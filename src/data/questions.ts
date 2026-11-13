import { environments, stages } from "./journey.ts";
import type { StageId } from "./journey.ts";

export type Answer = { text: string; correct: boolean; response?: string };
export type Question = {
  stage: StageId;
  title: string;
  answers: [Answer, Answer, Answer];
};

// One question per jump, through the LAST platform of each wallpaper.
// Keep the stages in route order and three answers per question.
// Every answer to the genero question is deliberately correct.
export const questions: Question[] = [
  {
    stage: "napoli",
    title: "Chi comanda davvero in famiglia?",
    answers: [
      { text: "Il governo italiano", correct: false },
      { text: "Il Vesuvio", correct: false },
      {
        text: "Susanna, ovviamente!",
        correct: true,
        response: "Esatto! Pure il Vesuvio chiede il permesso. ♡",
      },
    ],
  },
  {
    stage: "napoli",
    title: "Qual è il segreto di una vera napoletana?",
    answers: [
      { text: "Mettere la panna nella carbonara", correct: false },
      {
        text: "Cuore, carattere e una risposta per tutto",
        correct: true,
        response: "Core grande e risposta pronta. Chesta è Susanna!",
      },
      { text: "Spezzare gli spaghetti", correct: false },
    ],
  },
  {
    stage: "napoli",
    title: "Che significa «ho preparato due cosette»?",
    answers: [
      {
        text: "Un pranzo per tutto il condominio",
        correct: true,
        response: "Due cosette… e ventisette contenitori per portarle a casa!",
      },
      { text: "Due cracker contati", correct: false },
      { text: "Il frigorifero è vuoto", correct: false },
    ],
  },
  {
    stage: "napoli",
    title: "Quando è davvero finito il pranzo della domenica?",
    answers: [
      { text: "Quando suona il timer", correct: false },
      { text: "Appena finisce il primo", correct: false },
      {
        text: "Quando Susanna smette di offrirti il bis",
        correct: true,
        response: "Quindi mai. Slaccia un bottone: prossima tappa, Casal di Principe!",
      },
    ],
  },
  {
    stage: "casal",
    title: "Prima sosta a Casal di Principe: cosa si assaggia?",
    answers: [
      { text: "Una barretta triste e scondita", correct: false },
      {
        text: "Una mozzarella, poi un’altra per sicurezza",
        correct: true,
        response: "La prima era buona. La seconda serve per confermare. È scienza!",
      },
      { text: "Solo il menu, senza ordinare", correct: false },
    ],
  },
  {
    stage: "casal",
    title: "Cosa succede quando Susanna dice «passo cinque minuti»?",
    answers: [
      {
        text: "Si mette il caffè e si apparecchia",
        correct: true,
        response: "Cinque minuti campani: il tempo si misura in tazzine e chiacchiere!",
      },
      { text: "Parte un cronometro olimpico", correct: false },
      { text: "Tutti restano sulla porta in silenzio", correct: false },
    ],
  },
  {
    stage: "casal",
    title: "Qual è il navigatore più affidabile del gruppo?",
    answers: [
      { text: "Quello scarico nel cassetto", correct: false },
      { text: "Il piccione sulla piazza", correct: false },
      {
        text: "Susanna: «Te l’avevo detto di girare là!»",
        correct: true,
        response: "Ricalcolo del percorso… e scuse ufficiali alla navigatrice!",
      },
    ],
  },
  {
    stage: "casal",
    title: "Come si riconosce la borsa di Susanna?",
    answers: [
      { text: "È completamente vuota", correct: false },
      {
        text: "C’è tutto, tranne le chiavi al primo tentativo",
        correct: true,
        response: "Fazzoletti, caramelle, il necessario per tre giorni… ah, eccole!",
      },
      { text: "Contiene solo un manuale di fisica", correct: false },
    ],
  },
  {
    stage: "casal",
    title: "Qual è la risposta giusta a «Hai mangiato?»?",
    answers: [
      {
        text: "Qualunque sia, arriva comunque un piatto",
        correct: true,
        response: "«Ho già mangiato» non è una risposta riconosciuta in questa casa!",
      },
      { text: "Un grafico con le calorie", correct: false },
      { text: "Una domanda al commercialista", correct: false },
    ],
  },
  {
    stage: "casal",
    title: "Prima di ripartire per Caserta, cosa portiamo?",
    answers: [
      { text: "Il lampione della piazza", correct: false },
      { text: "Un sacco pieno di compiti", correct: false },
      {
        text: "Sorrisi e un pacchetto di cose buone",
        correct: true,
        response: "Viaggiare leggeri? Certo. Ma senza merenda non si parte!",
      },
    ],
  },
  {
    stage: "caserta",
    title: "Che succede se qualcuno mette l’ananas sulla pizza?",
    answers: [
      { text: "Si organizza una conferenza", correct: false },
      { text: "Si cambia argomento", correct: false },
      {
        text: "Si convoca un tribunale napoletano",
        correct: true,
        response: "La corte ha deciso: colpevole! Senza possibilità di bis.",
      },
    ],
  },
  {
    stage: "caserta",
    title: "Qual è il superpotere di Susanna?",
    answers: [
      { text: "Sapere sempre tutto", correct: false },
      { text: "Far sorridere le persone", correct: false },
      {
        text: "Entrambi, ovviamente",
        correct: true,
        response: "Due superpoteri, una sola Susanna. E senza mantello!",
      },
    ],
  },
  {
    stage: "caserta",
    title: "Quanto vale il genero che ha creato questo gioco?",
    answers: [
      {
        text: "10/10",
        correct: true,
        response: "Dorjan e Gaia ringraziano. E accettano volentieri una fetta di torta!",
      },
      {
        text: "11/10",
        correct: true,
        response:
          "Promosso a genero dell’anno! Il premio è un altro piatto di pasta.",
      },
      {
        text: "Deve ancora dimostrare il suo valore",
        correct: true,
        response:
          "Giustissimo. Dorjan e Gaia tornano ai fornelli: l’esame non finisce mai!",
      },
    ],
  },
  {
    stage: "caserta",
    title: "Cosa direbbe Susanna davanti a tutte queste stanze?",
    answers: [
      {
        text: "Belle, ma chi le pulisce tutte?",
        correct: true,
        response:
          "Finalmente qualcuno fa le domande importanti. Passate lo straccio!",
      },
      { text: "Ci starebbe un monolocale", correct: false },
      { text: "Manca giusto un corridoio", correct: false },
    ],
  },
  {
    stage: "caserta",
    title: "Cosa serve per attraversare tutti questi giardini?",
    answers: [
      { text: "Scarpe con il tacco dodici", correct: false },
      {
        text: "Scarpe comode e una sosta merenda",
        correct: true,
        response: "La cultura nutre lo spirito. La merenda fa il resto.",
      },
      { text: "Un abbonamento all’ascensore", correct: false },
    ],
  },
  {
    stage: "salerno",
    title: "Come si fa la foto perfetta sul lungomare?",
    answers: [
      { text: "Con il dito davanti alla lente", correct: false },
      { text: "Fotografando solo le scarpe", correct: false },
      {
        text: "Dopo venti tentativi e «fammela vedere»",
        correct: true,
        response: "Bellissima! Ma facciamone un’altra, per sicurezza.",
      },
    ],
  },
  {
    stage: "salerno",
    title: "Quanto dura una passeggiata «veloce» con Susanna?",
    answers: [
      {
        text: "Tre saluti, due chiacchiere e un caffè",
        correct: true,
        response:
          "Il contapassi segna poco. Il contachiacchiere ha finito la batteria!",
      },
      { text: "Quattro secondi precisi", correct: false },
      { text: "Meno del semaforo verde", correct: false },
    ],
  },
  {
    stage: "salerno",
    title: "Cosa non può mancare al compleanno di Susanna?",
    answers: [
      { text: "Una riunione di condominio", correct: false },
      {
        text: "Torta, abbracci e un bis di tutto",
        correct: true,
        response: "La dieta? Ci vediamo lunedì. Mo’ si festeggia!",
      },
      { text: "Un’insalata senza condimento", correct: false },
    ],
  },
  {
    stage: "salerno",
    title: "A cosa servono tutte queste luci?",
    answers: [
      { text: "A trovare le chiavi in borsa", correct: false },
      { text: "A leggere la bolletta da lontano", correct: false },
      {
        text: "A fare da sfondo al sorriso di Susanna",
        correct: true,
        response: "Le luci fanno del loro meglio, ma il sorriso vince sempre.",
      },
    ],
  },
  {
    stage: "salerno",
    title: "È ora di tornare a casa?",
    answers: [
      {
        text: "Macché! Un ultimo salto a Marina",
        correct: true,
        response:
          "L’avventura continua. E qualcuno ha nascosto una torta sul mare…",
      },
      { text: "Sì, c’è da stirare", correct: false },
      { text: "Sì, per controllare il contatore", correct: false },
    ],
  },
  {
    stage: "marina-finale",
    title: "Benvenuta a Marina! Cosa manca ancora?",
    answers: [
      { text: "Una lezione di ragioneria", correct: false },
      {
        text: "Una festa tutta per Susanna",
        correct: true,
        response: "Mare, sorrisi e torta: stavolta il programma è perfetto!",
      },
      { text: "Una coda all’ufficio postale", correct: false },
    ],
  },
  {
    stage: "marina-finale",
    title: "Quante candeline mettiamo sulla torta?",
    answers: [
      { text: "Serve prima una commissione tecnica", correct: false },
      { text: "Quelle rimaste dal Natale del 1998", correct: false },
      {
        text: "Abbastanza per un desiderio bellissimo",
        correct: true,
        response: "Gli anni non si contano. Le fette, invece, sì: almeno due!",
      },
    ],
  },
  {
    stage: "marina-finale",
    title: "Chi assaggia la torta prima degli altri?",
    answers: [
      {
        text: "Susanna: controllo qualità ufficiale",
        correct: true,
        response:
          "Assaggio approvato. Ora serve il secondo controllo, con una fetta più grande.",
      },
      { text: "Il gabbiano sul tetto", correct: false },
      { text: "Il commercialista", correct: false },
    ],
  },
  {
    stage: "marina-finale",
    title: "Qual è il regalo che non occupa spazio in valigia?",
    answers: [
      { text: "Un frigorifero a due ante", correct: false },
      {
        text: "Un ricordo bello insieme",
        correct: true,
        response: "Sta tutto nel cuore. E non paga neanche il bagaglio extra!",
      },
      { text: "Tre ombrelloni e una sdraio", correct: false },
    ],
  },
  {
    stage: "marina-finale",
    title: "Come si canta «Tanti auguri» in famiglia?",
    answers: [
      { text: "In assoluto silenzio", correct: false },
      { text: "Con un esame di solfeggio", correct: false },
      {
        text: "Ognuno in una tonalità, tutti con amore",
        correct: true,
        response:
          "L’intonazione è facoltativa. L’affetto arriva forte e chiaro!",
      },
    ],
  },
  {
    stage: "marina-finale",
    title: "Per chi si accende questo ultimo tramonto?",
    answers: [
      { text: "Per chi ha parcheggiato meglio", correct: false },
      { text: "Per il venditore di granite", correct: false },
      {
        text: "Per Susanna, con tutto il nostro affetto!",
        correct: true,
        response: "Questa festa è tutta per te. Buon compleanno, Susanna! ♡",
      },
    ],
  },
];

export function getStageProgress(questionIndex: number) {
  const stageId = questions[questionIndex].stage;
  const stageIndex = stages.findIndex((stage) => stage.id === stageId);
  const stage = stages[stageIndex];
  const environment = environments[stage.city];
  const firstQuestion = questions.findIndex(
    (question) => question.stage === stageId,
  );
  return {
    stage,
    stageIndex,
    environment,
    platformIndex: questionIndex - firstQuestion,
    jumpCount: environment.platforms.length - 1,
  };
}
