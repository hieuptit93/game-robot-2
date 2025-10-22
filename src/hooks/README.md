# useVoiceRecognition Hook

Hook tổng hợp để xử lý ghi âm giọng nói, phát hiện VAD (Voice Activity Detection), và chấm điểm qua API.

## Tính năng

- ✅ Khởi tạo microphone và audio context
- ✅ Voice Activity Detection (VAD) thông minh
- ✅ Ghi âm tự động khi phát hiện giọng nói
- ✅ Gửi audio đến API để chấm điểm
- ✅ Quản lý trạng thái rõ ràng
- ✅ Hỗ trợ ghi âm thủ công
- ✅ Cleanup tự động khi unmount

## Cài đặt

```bash
npm install recordrtc
```

## Các trạng thái

Hook quản lý 7 trạng thái chính:

1. **IDLE** - Trạng thái ban đầu, chưa khởi động
2. **INITIALIZING** - Đang khởi tạo microphone và audio context
3. **LISTENING** - Đang lắng nghe để phát hiện giọng nói
4. **RECORDING** - Đang ghi âm
5. **PROCESSING** - Đang gửi audio đến API để xử lý
6. **COMPLETED** - Hoàn thành, có kết quả
7. **ERROR** - Có lỗi xảy ra

## Cách sử dụng cơ bản

```javascript
import { useVoiceRecognition } from './hooks/useVoiceRecognition'

const MyComponent = () => {
    const voiceRecognition = useVoiceRecognition({
        // Cấu hình VAD
        silenceThreshold: -30,
        speechThreshold: -18,
        minSpeechDuration: 300,
        maxSilenceDuration: 800,
        maxRecordingTime: 7000,
        
        // Cấu hình kiểm tra phát âm
        textRefs: 'hello world', // Text cần kiểm tra phát âm
        requestId: 'my-request-001',
        
        // Callbacks
        onStateChange: (state, error) => console.log('State:', state),
        onScore: (result) => console.log('Score:', result.total_score),
        onError: (error) => console.error('Error:', error)
    })

    const {
        state,
        isListening,
        isRecording,
        recordingBlob,
        score,
        error,
        start,
        stop,
        reset
    } = voiceRecognition

    return (
        <div>
            <p>Trạng thái: {state}</p>
            <button onClick={start} disabled={isListening}>
                Bắt đầu
            </button>
            <button onClick={stop} disabled={state === 'IDLE'}>
                Dừng
            </button>
            {score && <p>Điểm: {JSON.stringify(score)}</p>}
        </div>
    )
}
```

## Cấu hình chi tiết

### VAD Configuration

```javascript
{
    silenceThreshold: -30,      // Ngưỡng im lặng (dB)
    speechThreshold: -18,       // Ngưỡng phát hiện giọng nói (dB)
    minSpeechDuration: 300,     // Thời gian tối thiểu phát hiện giọng nói (ms)
    maxSilenceDuration: 800,    // Thời gian im lặng tối đa trước khi dừng (ms)
    maxRecordingTime: 7000,     // Thời gian ghi âm tối đa (ms)
}
```

### Pronunciation Check Configuration

```javascript
{
    textRefs: 'hello world',        // Text để kiểm tra phát âm
    requestId: 'unique-request-id', // ID để track request
}
```

### Audio Configuration

```javascript
{
    sampleRate: 16000,          // Tần số lấy mẫu
    channels: 1,                // Số kênh audio
}
```

## API Response

Hook sử dụng hàm `checkPronunciation` từ `utils.js` để gửi audio đến API chấm điểm phát âm. API trả về dữ liệu đã được decrypt.

Ví dụ response sau khi decrypt:
```javascript
{
    "total_score": 85,
    "text_refs": "hello world",
    "result": [{
        "letters": [
            { "letter": "h", "score": 90 },
            { "letter": "e", "score": 85 },
            // ...
        ]
    }]
}
```

## Ghi âm thủ công

Ngoài chế độ VAD tự động, hook cũng hỗ trợ ghi âm thủ công:

```javascript
const {
    startManualRecording,
    stopManualRecording,
    isRecording
} = useVoiceRecognition()

// Bắt đầu ghi âm thủ công
await startManualRecording()

// Dừng ghi âm thủ công
const blob = await stopManualRecording()
```

## Xử lý lỗi

```javascript
const { hasError, error, reset } = useVoiceRecognition({
    onError: (errorMessage) => {
        console.error('Voice recognition error:', errorMessage)
        // Xử lý lỗi tùy chỉnh
    }
})

if (hasError) {
    return (
        <div>
            <p>Lỗi: {error}</p>
            <button onClick={reset}>Thử lại</button>
        </div>
    )
}
```

## Sử dụng trong project khác

1. Copy file `useVoiceRecognition.js` vào project mới
2. Cài đặt dependency: `npm install recordrtc`
3. Import và sử dụng như ví dụ trên

## Lưu ý

- Hook tự động cleanup khi component unmount
- Cần quyền truy cập microphone từ user
- Hoạt động tốt nhất trên HTTPS
- Hỗ trợ tất cả trình duyệt hiện đại
- VAD sử dụng thuật toán adaptive threshold dựa trên noise floor

## Troubleshooting

### Lỗi microphone access
- Đảm bảo website chạy trên HTTPS
- Kiểm tra quyền microphone trong browser
- Thử refresh trang và cho phép lại

### VAD không hoạt động
- Kiểm tra ngưỡng `speechThreshold` và `silenceThreshold`
- Đảm bảo microphone hoạt động tốt
- Kiểm tra noise level trong môi trường

### API không hoạt động
- Kiểm tra `apiEndpoint` và `apiHeaders`
- Đảm bảo API hỗ trợ multipart/form-data
- Kiểm tra CORS settings