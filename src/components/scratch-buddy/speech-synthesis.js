const scratchSpeechSynthesis = (tip, pause = false) => {

    if (pause) {
        speechSynthesis.pause();
        speechSynthesis.cancel();
        return;
    }

    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        const utterance = new SpeechSynthesisUtterance();
        const utterance2 = new SpeechSynthesisUtterance();


        console.log('DICA', tip);
        console.log('TAMANHO', tip.length);

        // utterance.text = tip;
        utterance.lang = 'pt-br';
        utterance.pitch = 3;

        // utterance2.text = tip;
        utterance2.lang = 'pt-br';
        utterance2.pitch = 3;

        if (tip && tip.length > 200) {
            utterance.text = tip.substring(0, 200);
            utterance2.text = tip.substring(201, tip.length);

            speechSynthesis.speak(utterance);
            speechSynthesis.speak(utterance2);

            /* while (true) {

                if (!speechSynthesis.speaking) {
                    speechSynthesis.speak(utterance2);
                    return;
                }

            }*/
        } else {
            utterance.text = tip;
            speechSynthesis.speak(utterance);
        }


    }
};

export default scratchSpeechSynthesis;
