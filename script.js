
// DOM 요소 가져오기
const drawButton = document.getElementById('drawButton');
const selectedNumbers = document.getElementById('selectedNumbers');
const resultContainer = document.getElementById('result');

// 초기에는 결과 컨테이너 숨기기
resultContainer.style.display = 'none';

// 랜덤으로 5명을 뽑는 함수
function drawRandomNumbers() {
  const totalStudents = 27;
  const selectCount = 5;
  
  // 1부터 27까지의 숫자 배열 생성
  const availableNumbers = Array.from({length: totalStudents}, (_, i) => i + 1);
  
  // 피셔-예이츠 셔플 알고리즘을 사용하여 랜덤하게 섞기
  for (let i = availableNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
  }
  
  // 처음 5개 숫자 선택하고 정렬
  const selectedNums = availableNumbers.slice(0, selectCount).sort((a, b) => a - b);
  
  return selectedNums;
}

// 결과를 화면에 표시하는 함수
function displayResults(numbers) {
  // 기존 결과 초기화
  selectedNumbers.innerHTML = '';
  
  // 결과 컨테이너 표시
  resultContainer.style.display = 'block';
  
  // 각 번호를 배지로 표시 (순차적 애니메이션)
  numbers.forEach((number, index) => {
    setTimeout(() => {
      const badge = document.createElement('div');
      badge.className = 'number-badge';
      badge.innerHTML = `<i class="fas fa-user-check me-1"></i>${number}번`;
      badge.style.animationDelay = `${index * 0.1}s`;
      selectedNumbers.appendChild(badge);
    }, index * 200);
  });
  
  // 완료 후 성공 알림
  setTimeout(() => {
    Swal.fire({
      title: '🎉 당번 선정 완료!',
      html: `오늘의 청소 당번은 <strong style="color: #10B981;">${numbers.join('번, ')}번</strong>입니다!`,
      icon: 'success',
      confirmButtonText: '확인',
      confirmButtonColor: '#10B981',
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }, numbers.length * 200 + 500);
}

// 버튼 클릭 이벤트 리스너
drawButton.addEventListener('click', async () => {
  // 시작 확인 알림
  const result = await Swal.fire({
    title: '청소 당번을 뽑으시겠습니까?',
    text: '1번부터 27번까지 중에서 5명을 랜덤으로 선택합니다',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#8B5CF6',
    cancelButtonColor: '#6B7280',
    confirmButtonText: '네, 뽑겠습니다!',
    cancelButtonText: '취소',
    reverseButtons: true
  });
  
  if (!result.isConfirmed) return;
  
  // 버튼 비활성화 및 로딩 상태
  drawButton.disabled = true;
  drawButton.innerHTML = '<span class="loading-spinner me-2"></span>뽑는 중...';
  drawButton.classList.add('pulse-animation');
  
  // 로딩 알림
  Swal.fire({
    title: '당번을 뽑고 있습니다...',
    html: '잠시만 기다려주세요 <i class="fas fa-spinner fa-spin"></i>',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    timer: 2000,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  
  // 결과 생성 및 표시
  setTimeout(() => {
    Swal.close();
    const randomNumbers = drawRandomNumbers();
    displayResults(randomNumbers);
    
    // 버튼 상태 복원
    drawButton.disabled = false;
    drawButton.innerHTML = '<i class="fas fa-dice me-2"></i>다시 뽑기';
    drawButton.classList.remove('pulse-animation');
  }, 2500);
});

// 페이지 로드 시 환영 메시지
window.addEventListener('load', () => {
  console.log('청소 당번 뽑기 앱이 준비되었습니다!');
  
  // 환영 알림
  setTimeout(() => {
    Swal.fire({
      title: '환영합니다! 👋',
      text: '청소 당번 뽑기 앱에 오신 것을 환영합니다!',
      icon: 'info',
      confirmButtonText: '시작하기',
      confirmButtonColor: '#8B5CF6',
      timer: 4000,
      timerProgressBar: true
    });
  }, 500);
});

// 키보드 단축키 (스페이스바로 뽑기)
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !drawButton.disabled) {
    event.preventDefault();
    drawButton.click();
  }
});

// 더블클릭 방지
drawButton.addEventListener('dblclick', (event) => {
  event.preventDefault();
});
