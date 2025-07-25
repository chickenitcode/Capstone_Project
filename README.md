# CAPSTONE PROJECT 1
# Mai Tấn Giáp
## Voting dApp
### Yêu Cầu
- Viết smart contract voting:
    - Tạo danh sách ứng viên
    - Mỗi địa chỉ được vote 1 lần
    - Event ghi log người vote
    - Hàm đọc kết quả
- Thêm các ràng buộc:
    - Thêm 1 token address
    - Voting power được tính đơn giản như sau
        - nếu token balance của người vote đang giữ nhỏ hơn 1000 thì voting power là 1
        - lớn hơn 1k nhỏ hơn 2k là 2
        - lớn hơn 2k là 3
- Lưu ý:
    - Viết smartcontract hoàn chỉnh
    - Deploy lên testnet ( Sepolia).
     Verify contract trên Etherscan.
    - Gửi link Etherscan + source code.
    - Gửi video quay màn hình demo deploy và test.

---

## Tổng quan dự án
Dự án Voting dApp là một ứng dụng phi tập trung cho phép người dùng bỏ phiếu cho các ứng viên bằng cách sử dụng token ERC20 làm điều kiện xác định sức mạnh lá phiếu (voting power). Mỗi địa chỉ chỉ được bỏ phiếu một lần, kết quả được ghi nhận minh bạch trên blockchain.

## Cấu trúc thư mục
- `contracts/`: Chứa các smart contract (VotingDApp.sol, MockERC20.sol)
- `deploy/`: Script triển khai contract
- `scripts/`: Script demo tương tác với contract
- `test/`: Test tự động cho contract
- `data/abi/`: ABI của các contract đã biên dịch
- `deployments/`: Thông tin deployment trên các mạng (ví dụ: sepolia)

## Hướng dẫn cài đặt
```bash
yarn install
```

## Compile contract
```bash
yarn compile
```
## Chạy test
```bash
yarn test
```


## Deploy contract
Chỉnh sửa file `deploy/1-deploy.ts` nếu cần, sau đó chạy:
```bash
npx hardhat deploy --network sepolia
```
### Địa chỉ contract sau deploy:

- Voting: 0x5102f9E49a4AB0accAc7017CFD4cB6d85603c2d7

- MockERC20: 0x8D1c76321874f7467a33eab161284Ba1Fb88f233

## Verify contract sau khi deploy
```
npx hardhat verify --network sepolia 0x5102f9E49a4AB0accAc7017CFD4cB6d85603c2d7 0x8D1c76321874f7467a33eab161284Ba1Fb88f233
```

### Địa chỉ contract đã verify:
https://sepolia.etherscan.io/address/0x5102f9E49a4AB0accAc7017CFD4cB6d85603c2d7#code

## Mô tả các contract chính
- **VotingDApp.sol**: Quản lý danh sách ứng viên, ghi nhận phiếu bầu, tính voting power dựa trên số dư token, emit event khi vote, và trả về kết quả.
- **MockERC20.sol**: Token ERC20 mẫu dùng để kiểm thử và làm điều kiện voting.

## Testcase
- Thêm/Xóa ứng viên: Owner có thể thêm và xóa ứng viên.

- Quyền hạn owner: Người không phải owner không thể thêm/xóa ứng viên.

- Bỏ phiếu đúng: Voter bỏ phiếu với sức mạnh tương ứng token.

- Chống vote lại: Mỗi địa chỉ chỉ được vote một lần.

- Ứng viên không tồn tại: Không thể vote cho ID không hợp lệ.

- Sức mạnh phiếu bầu: Kiểm tra đúng voting power theo số dư token.
