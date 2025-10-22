# Space Pronunciation Adventure

Một trò chơi arcade 2D pixel art được xây dựng bằng ReactJS để hỗ trợ học phát âm tiếng Anh thông qua gameplay bắn tàu vũ trụ.

## Tính năng chính

### Giao diện game
- **Header**: Progress bar, timer đếm ngược, và điểm số
- **Game Area**: Nền vũ trụ với ngôi sao, tàu vũ trụ người chơi, và thiên thạch
- **Footer**: Hiển thị từ cần phát âm và hướng dẫn

### Gameplay
- **Mục tiêu**: Hoàn thành 10 từ trong vòng 2 phút
- **Cơ chế**: Phát âm đúng từ để bắn phá thiên thạch và tiến về đích
- **Điều khiển tạm thời**: 
  - Phím 'D': Mô phỏng phát âm đúng
  - Phím 'S': Mô phỏng phát âm sai
  - Phím Space: Điều hướng menu

### Màn hình game
1. **Start Screen**: Màn hình khởi động
2. **Instruction Screen**: Hướng dẫn cách chơi
3. **Main Game**: Gameplay chính
4. **Win Screen**: Màn hình chiến thắng
5. **Game Over Screen**: Màn hình thua cuộc

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build cho production
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/
│   ├── Header/          # Thanh header với progress bar, timer, score
│   ├── GameArea/        # Khu vực gameplay chính
│   ├── Footer/          # Hiển thị từ cần phát âm
│   ├── PlayerShip/      # Component tàu vũ trụ người chơi
│   ├── Obstacle/        # Component thiên thạch/vật cản
│   ├── Stars/           # Background ngôi sao
│   ├── Bullet/          # Hiệu ứng đạn bắn
│   ├── Explosion/       # Hiệu ứng nổ
│   └── Screens/         # Các màn hình menu
├── App.js               # Component chính quản lý game state
└── index.js             # Entry point
```

## Công nghệ sử dụng

- **ReactJS**: Framework chính
- **CSS Modules**: Styling với pixel art effects
- **React Hooks**: Quản lý state và lifecycle

## Sound Effects

Game bao gồm các hiệu ứng âm thanh được tạo bằng Web Audio API:

### Âm thanh gameplay:
- **Laser Sound**: Âm thanh bắn đạn với hiệu ứng sweeping
- **Explosion Sound**: Âm thanh nổ với white noise và filter
- **Success Sound**: Hợp âm C-E-G khi phát âm đúng
- **Error Sound**: Âm thanh thấp khi phát âm sai

### Âm thanh UI:
- **Click Sound**: Âm thanh khi nhấn nút
- **Record Start/Stop**: Âm thanh bắt đầu/kết thúc ghi âm
- **Countdown Beep**: Âm thanh đếm ngược 3-2-1
- **Victory Sound**: Giai điệu chiến thắng
- **Game Over Sound**: Giai điệu thất bại

### Nhạc nền:
- **Ambient Music**: Nhạc nền không gian với oscillator
- **Volume Control**: Âm lượng có thể điều chỉnh
- **Auto Play**: Tự động phát khi chơi game

## Tính năng sẽ phát triển

- Thêm nhiều level và từ vựng
- Multiplayer mode
- Lưu trữ high scores
- Cài đặt âm thanh chi tiết

## Hướng dẫn chơi

1. Nhấn Space để bắt đầu
2. Đọc từ hiển thị ở cuối màn hình
3. Nhấn 'D' để mô phỏng phát âm đúng
4. Tàu vũ trụ sẽ bắn và phá hủy thiên thạch
5. Hoàn thành 10 từ trước khi hết thời gian để chiến thắng!

Game được thiết kế với phong cách retro pixel art, tạo cảm giác nostalgic và thú vị cho việc học phát âm tiếng Anh.