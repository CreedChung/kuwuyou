import { useEffect } from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";

interface UseSpeechInputOptions {
	onTranscriptChange?: (transcript: string) => void;
	language?: string;
	continuous?: boolean;
}

export function useSpeechInput({
	onTranscriptChange,
	language = "zh-CN",
	continuous = true,
}: UseSpeechInputOptions = {}) {
	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechRecognition();

	// 当转录文本变化时触发回调
	useEffect(() => {
		if (transcript && onTranscriptChange) {
			onTranscriptChange(transcript);
		}
	}, [transcript, onTranscriptChange]);

	const startListening = () => {
		if (!browserSupportsSpeechRecognition) {
			throw new Error("浏览器不支持语音识别");
		}

		if (!isMicrophoneAvailable) {
			throw new Error("无法访问麦克风");
		}

		resetTranscript();
		SpeechRecognition.startListening({
			continuous,
			language,
		});
	};

	const stopListening = () => {
		SpeechRecognition.stopListening();
	};

	const toggleListening = () => {
		if (listening) {
			stopListening();
		} else {
			startListening();
		}
	};

	return {
		transcript,
		listening,
		resetTranscript,
		startListening,
		stopListening,
		toggleListening,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	};
}
