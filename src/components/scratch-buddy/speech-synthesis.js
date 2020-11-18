const scratchSpeechSynthesis = (tip, pause = false) => {

    if (pause) {
        speechSynthesis.pause();
        speechSynthesis.cancel();
        return;
    }

    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        const utterance = new SpeechSynthesisUtterance();

        utterance.text = tip;
        utterance.lang = 'pt-br';
        // utterance.rate = 0.9;
        utterance.pitch = 3;

        speechSynthesis.speak(utterance);

    }
};

export default scratchSpeechSynthesis;
