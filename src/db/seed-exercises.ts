import 'dotenv/config';
import { db } from './index';
import { exercises } from './schema';

// 운동 종목 시드 데이터
// subCategory: 해당 운동이 보조적으로 타겟하는 신체 부위
const exercisesData = [
  // 가슴 운동
  {
    name: '벤치 프레스',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '바벨',
    description: '가슴 전체를 타겟하는 대표적인 복합 운동',
  },
  {
    name: '인클라인 벤치 프레스',
    mainCategory: '가슴',
    subCategory: '전면삼각근',
    equipment: '바벨',
    description: '상부 가슴을 타겟하는 운동',
  },
  {
    name: '디클라인 벤치 프레스',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '바벨',
    description: '하부 가슴을 타겟하는 운동',
  },
  {
    name: '덤벨 프레스',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '덤벨',
    description: '덤벨을 이용한 가슴 프레스',
  },
  {
    name: '인클라인 덤벨 프레스',
    mainCategory: '가슴',
    subCategory: '전면삼각근',
    equipment: '덤벨',
    description: '상부 가슴을 타겟하는 덤벨 운동',
  },
  {
    name: '체스트 프레스 머신',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '머신',
    description: '머신을 이용한 안전한 가슴 운동',
  },
  {
    name: '케이블 크로스오버',
    mainCategory: '가슴',
    subCategory: '전면삼각근',
    equipment: '케이블',
    description: '케이블을 이용한 가슴 고립 운동',
  },
  {
    name: '펙덱 플라이',
    mainCategory: '가슴',
    subCategory: '전면삼각근',
    equipment: '머신',
    description: '가슴 안쪽을 타겟하는 고립 운동',
  },
  {
    name: '덤벨 플라이',
    mainCategory: '가슴',
    subCategory: '전면삼각근',
    equipment: '덤벨',
    description: '가슴 스트레칭과 수축을 위한 운동',
  },
  {
    name: '푸시업',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '맨몸',
    description: '맨몸으로 하는 대표적인 가슴 운동',
  },
  {
    name: '딥스',
    mainCategory: '가슴',
    subCategory: '삼두',
    equipment: '맨몸',
    description: '하부 가슴과 삼두를 타겟하는 운동',
  },

  // 등 운동
  {
    name: '데드리프트',
    mainCategory: '등',
    subCategory: '햄스트링',
    equipment: '바벨',
    description: '전신 근력 발달을 위한 대표 운동',
  },
  {
    name: '바벨 로우',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '바벨',
    description: '등 전체를 타겟하는 복합 운동',
  },
  {
    name: '덤벨 로우',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '덤벨',
    description: '한 팔씩 등을 타겟하는 운동',
  },
  {
    name: '티바 로우',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '바벨',
    description: '등 중앙부를 타겟하는 운동',
  },
  {
    name: '랫 풀다운',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '머신',
    description: '광배근을 타겟하는 머신 운동',
  },
  {
    name: '시티드 케이블 로우',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '케이블',
    description: '케이블을 이용한 등 운동',
  },
  {
    name: '풀업',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '맨몸',
    description: '맨몸 등 운동의 대표',
  },
  {
    name: '친업',
    mainCategory: '등',
    subCategory: '이두',
    equipment: '맨몸',
    description: '이두와 등을 함께 타겟하는 운동',
  },
  {
    name: '펜들레이 로우',
    mainCategory: '등',
    subCategory: '코어',
    equipment: '바벨',
    description: '폭발적인 등 운동',
  },
  {
    name: '케이블 풀오버',
    mainCategory: '등',
    subCategory: '삼두',
    equipment: '케이블',
    description: '광배근 고립 운동',
  },

  // 어깨 운동
  {
    name: '오버헤드 프레스',
    mainCategory: '어깨',
    subCategory: '삼두',
    equipment: '바벨',
    description: '어깨 전체를 타겟하는 복합 운동',
  },
  {
    name: '덤벨 숄더 프레스',
    mainCategory: '어깨',
    subCategory: '삼두',
    equipment: '덤벨',
    description: '덤벨을 이용한 어깨 프레스',
  },
  {
    name: '시티드 덤벨 숄더 프레스',
    mainCategory: '어깨',
    subCategory: '삼두',
    equipment: '덤벨',
    description: '앉아서 하는 어깨 프레스',
  },
  {
    name: '아놀드 프레스',
    mainCategory: '어깨',
    subCategory: '삼두',
    equipment: '덤벨',
    description: '회전을 포함한 어깨 프레스',
  },
  {
    name: '사이드 레터럴 레이즈',
    mainCategory: '어깨',
    subCategory: '승모근',
    equipment: '덤벨',
    description: '측면 삼각근을 타겟하는 운동',
  },
  {
    name: '프론트 레이즈',
    mainCategory: '어깨',
    subCategory: '상부가슴',
    equipment: '덤벨',
    description: '전면 삼각근을 타겟하는 운동',
  },
  {
    name: '리어 델트 플라이',
    mainCategory: '어깨',
    subCategory: '승모근',
    equipment: '덤벨',
    description: '후면 삼각근을 타겟하는 운동',
  },
  {
    name: '페이스 풀',
    mainCategory: '어깨',
    subCategory: '승모근',
    equipment: '케이블',
    description: '후면 삼각근과 외회전근을 타겟',
  },
  {
    name: '숄더 프레스 머신',
    mainCategory: '어깨',
    subCategory: '삼두',
    equipment: '머신',
    description: '머신을 이용한 어깨 프레스',
  },
  {
    name: '업라이트 로우',
    mainCategory: '어깨',
    subCategory: '승모근',
    equipment: '바벨',
    description: '어깨와 승모근을 타겟하는 운동',
  },
  {
    name: '케이블 레터럴 레이즈',
    mainCategory: '어깨',
    subCategory: '승모근',
    equipment: '케이블',
    description: '케이블을 이용한 측면 삼각근 운동',
  },

  // 대퇴사두 운동
  {
    name: '바벨 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '바벨',
    description: '하체 전체를 타겟하는 대표 운동',
  },
  {
    name: '프론트 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '코어',
    equipment: '바벨',
    description: '대퇴사두근을 강조하는 스쿼트',
  },
  {
    name: '레그 프레스',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '머신',
    description: '머신을 이용한 하체 프레스',
  },
  {
    name: '핵 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '머신',
    description: '머신을 이용한 스쿼트',
  },
  {
    name: '레그 익스텐션',
    mainCategory: '대퇴사두',
    subCategory: null,
    equipment: '머신',
    description: '대퇴사두근 고립 운동',
  },
  {
    name: '시시 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '코어',
    equipment: '맨몸',
    description: '대퇴사두 고립 맨몸 운동',
  },
  {
    name: '불가리안 스플릿 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '덤벨',
    description: '한 다리씩 하는 고급 스쿼트',
  },
  {
    name: '런지',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '덤벨',
    description: '한 다리씩 타겟하는 하체 운동',
  },
  {
    name: '워킹 런지',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '덤벨',
    description: '걸으면서 하는 런지',
  },
  {
    name: '맨몸 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '맨몸',
    description: '맨몸으로 하는 기본 스쿼트',
  },
  {
    name: '점프 스쿼트',
    mainCategory: '대퇴사두',
    subCategory: '둔근',
    equipment: '맨몸',
    description: '폭발력을 기르는 스쿼트',
  },

  // 햄스트링 운동
  {
    name: '루마니안 데드리프트',
    mainCategory: '햄스트링',
    subCategory: '둔근',
    equipment: '바벨',
    description: '햄스트링과 둔근을 타겟',
  },
  {
    name: '스티프 레그 데드리프트',
    mainCategory: '햄스트링',
    subCategory: '둔근',
    equipment: '바벨',
    description: '햄스트링 스트레칭을 강조',
  },
  {
    name: '레그 컬',
    mainCategory: '햄스트링',
    subCategory: null,
    equipment: '머신',
    description: '햄스트링 고립 운동',
  },
  {
    name: '시티드 레그 컬',
    mainCategory: '햄스트링',
    subCategory: null,
    equipment: '머신',
    description: '앉아서 하는 햄스트링 운동',
  },
  {
    name: '라잉 레그 컬',
    mainCategory: '햄스트링',
    subCategory: null,
    equipment: '머신',
    description: '누워서 하는 햄스트링 운동',
  },
  {
    name: '덤벨 루마니안 데드리프트',
    mainCategory: '햄스트링',
    subCategory: '둔근',
    equipment: '덤벨',
    description: '덤벨을 이용한 RDL',
  },
  {
    name: '싱글 레그 데드리프트',
    mainCategory: '햄스트링',
    subCategory: '둔근',
    equipment: '덤벨',
    description: '한 다리로 하는 데드리프트',
  },
  {
    name: '굿모닝',
    mainCategory: '햄스트링',
    subCategory: '허리',
    equipment: '바벨',
    description: '햄스트링과 허리를 타겟',
  },
  {
    name: '노르딕 햄스트링 컬',
    mainCategory: '햄스트링',
    subCategory: null,
    equipment: '맨몸',
    description: '고강도 햄스트링 운동',
  },

  // 둔근 운동
  {
    name: '힙 쓰러스트',
    mainCategory: '둔근',
    subCategory: '햄스트링',
    equipment: '바벨',
    description: '둔근을 타겟하는 대표 운동',
  },
  {
    name: '덤벨 힙 쓰러스트',
    mainCategory: '둔근',
    subCategory: '햄스트링',
    equipment: '덤벨',
    description: '덤벨을 이용한 힙 쓰러스트',
  },
  {
    name: '글루트 브릿지',
    mainCategory: '둔근',
    subCategory: '햄스트링',
    equipment: '맨몸',
    description: '맨몸 둔근 운동',
  },
  {
    name: '싱글 레그 글루트 브릿지',
    mainCategory: '둔근',
    subCategory: '햄스트링',
    equipment: '맨몸',
    description: '한 다리 글루트 브릿지',
  },
  {
    name: '케이블 킥백',
    mainCategory: '둔근',
    subCategory: '햄스트링',
    equipment: '케이블',
    description: '케이블을 이용한 둔근 운동',
  },
  {
    name: '힙 어브덕션 머신',
    mainCategory: '둔근',
    subCategory: null,
    equipment: '머신',
    description: '둔근 외측을 타겟',
  },
  {
    name: '클램쉘',
    mainCategory: '둔근',
    subCategory: null,
    equipment: '맨몸',
    description: '중둔근을 타겟하는 운동',
  },
  {
    name: '사이드 라잉 힙 어브덕션',
    mainCategory: '둔근',
    subCategory: null,
    equipment: '맨몸',
    description: '옆으로 누워서 하는 둔근 운동',
  },
  {
    name: '스텝업',
    mainCategory: '둔근',
    subCategory: '대퇴사두',
    equipment: '덤벨',
    description: '계단 오르기 동작의 운동',
  },
  {
    name: '리버스 런지',
    mainCategory: '둔근',
    subCategory: '대퇴사두',
    equipment: '덤벨',
    description: '뒤로 빠지는 런지',
  },
  {
    name: '수모 데드리프트',
    mainCategory: '둔근',
    subCategory: '내전근',
    equipment: '바벨',
    description: '넓은 스탠스의 데드리프트',
  },

  // 종아리 운동
  {
    name: '스탠딩 카프 레이즈',
    mainCategory: '종아리',
    subCategory: null,
    equipment: '머신',
    description: '서서 하는 종아리 운동',
  },
  {
    name: '시티드 카프 레이즈',
    mainCategory: '종아리',
    subCategory: null,
    equipment: '머신',
    description: '앉아서 하는 종아리 운동',
  },
  {
    name: '레그 프레스 카프 레이즈',
    mainCategory: '종아리',
    subCategory: null,
    equipment: '머신',
    description: '레그 프레스 머신에서 하는 종아리',
  },
  {
    name: '덤벨 카프 레이즈',
    mainCategory: '종아리',
    subCategory: null,
    equipment: '덤벨',
    description: '덤벨을 들고 하는 종아리 운동',
  },
  {
    name: '맨몸 카프 레이즈',
    mainCategory: '종아리',
    subCategory: null,
    equipment: '맨몸',
    description: '맨몸 종아리 운동',
  },

  // 이두 운동
  {
    name: '바벨 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '바벨',
    description: '이두근 전체를 타겟하는 운동',
  },
  {
    name: '덤벨 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '덤벨',
    description: '덤벨을 이용한 이두 운동',
  },
  {
    name: '해머 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '덤벨',
    description: '상완근을 강조하는 컬',
  },
  {
    name: '인클라인 덤벨 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '덤벨',
    description: '이두 장두를 강조하는 운동',
  },
  {
    name: '케이블 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '케이블',
    description: '케이블을 이용한 이두 운동',
  },
  {
    name: '프리처 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '바벨',
    description: '이두 단두를 강조하는 운동',
  },
  {
    name: '컨센트레이션 컬',
    mainCategory: '이두',
    subCategory: null,
    equipment: '덤벨',
    description: '고립된 이두 운동',
  },
  {
    name: '이지바 컬',
    mainCategory: '이두',
    subCategory: '전완',
    equipment: '바벨',
    description: 'EZ바를 이용한 이두 운동',
  },
  {
    name: '스파이더 컬',
    mainCategory: '이두',
    subCategory: null,
    equipment: '덤벨',
    description: '인클라인 벤치에 엎드려 하는 컬',
  },

  // 삼두 운동
  {
    name: '트라이셉스 푸시다운',
    mainCategory: '삼두',
    subCategory: null,
    equipment: '케이블',
    description: '삼두근을 타겟하는 케이블 운동',
  },
  {
    name: '오버헤드 트라이셉스 익스텐션',
    mainCategory: '삼두',
    subCategory: null,
    equipment: '덤벨',
    description: '삼두 장두를 타겟하는 운동',
  },
  {
    name: '스컬 크러셔',
    mainCategory: '삼두',
    subCategory: null,
    equipment: '바벨',
    description: '삼두 전체를 타겟하는 운동',
  },
  {
    name: '클로즈그립 벤치 프레스',
    mainCategory: '삼두',
    subCategory: '가슴',
    equipment: '바벨',
    description: '삼두와 가슴을 함께 타겟',
  },
  {
    name: '트라이셉스 킥백',
    mainCategory: '삼두',
    subCategory: null,
    equipment: '덤벨',
    description: '삼두 고립 운동',
  },
  {
    name: '다이아몬드 푸시업',
    mainCategory: '삼두',
    subCategory: '가슴',
    equipment: '맨몸',
    description: '맨몸 삼두 운동',
  },
  {
    name: '케이블 오버헤드 익스텐션',
    mainCategory: '삼두',
    subCategory: null,
    equipment: '케이블',
    description: '케이블을 이용한 삼두 장두 운동',
  },
  {
    name: '딥스 (삼두)',
    mainCategory: '삼두',
    subCategory: '가슴',
    equipment: '맨몸',
    description: '삼두 중심의 딥스',
  },

  // 전완 운동
  {
    name: '리스트 컬',
    mainCategory: '전완',
    subCategory: null,
    equipment: '바벨',
    description: '전완 굴근을 타겟',
  },
  {
    name: '리버스 리스트 컬',
    mainCategory: '전완',
    subCategory: null,
    equipment: '바벨',
    description: '전완 신근을 타겟',
  },
  {
    name: '덤벨 리스트 컬',
    mainCategory: '전완',
    subCategory: null,
    equipment: '덤벨',
    description: '덤벨을 이용한 전완 운동',
  },
  {
    name: '리버스 컬',
    mainCategory: '전완',
    subCategory: '이두',
    equipment: '바벨',
    description: '상완요골근을 타겟',
  },
  {
    name: '파머스 워크',
    mainCategory: '전완',
    subCategory: '승모근',
    equipment: '덤벨',
    description: '그립력과 전완을 강화',
  },
  {
    name: '행잉 홀드',
    mainCategory: '전완',
    subCategory: '광배근',
    equipment: '맨몸',
    description: '매달려서 그립력 강화',
  },

  // 복근 운동
  {
    name: '크런치',
    mainCategory: '복근',
    subCategory: null,
    equipment: '맨몸',
    description: '상복부를 타겟하는 기본 운동',
  },
  {
    name: '리버스 크런치',
    mainCategory: '복근',
    subCategory: '고관절굴근',
    equipment: '맨몸',
    description: '하복부를 타겟하는 운동',
  },
  {
    name: '플랭크',
    mainCategory: '복근',
    subCategory: '어깨',
    equipment: '맨몸',
    description: '코어 전체를 강화하는 운동',
  },
  {
    name: '사이드 플랭크',
    mainCategory: '복근',
    subCategory: '옆구리',
    equipment: '맨몸',
    description: '옆구리를 타겟하는 운동',
  },
  {
    name: '레그 레이즈',
    mainCategory: '복근',
    subCategory: '고관절굴근',
    equipment: '맨몸',
    description: '하복부를 타겟하는 운동',
  },
  {
    name: '행잉 레그 레이즈',
    mainCategory: '복근',
    subCategory: '그립',
    equipment: '맨몸',
    description: '매달려서 하는 하복부 운동',
  },
  {
    name: '케이블 크런치',
    mainCategory: '복근',
    subCategory: null,
    equipment: '케이블',
    description: '케이블을 이용한 복근 운동',
  },
  {
    name: '러시안 트위스트',
    mainCategory: '복근',
    subCategory: '옆구리',
    equipment: '맨몸',
    description: '옆구리를 타겟하는 회전 운동',
  },
  {
    name: '바이시클 크런치',
    mainCategory: '복근',
    subCategory: '옆구리',
    equipment: '맨몸',
    description: '복근 전체를 타겟하는 운동',
  },
  {
    name: '마운틴 클라이머',
    mainCategory: '복근',
    subCategory: '어깨',
    equipment: '맨몸',
    description: '코어와 유산소를 결합한 운동',
  },
  {
    name: 'V업',
    mainCategory: '복근',
    subCategory: '고관절굴근',
    equipment: '맨몸',
    description: '상하복부를 동시에 타겟',
  },
  {
    name: '토 터치',
    mainCategory: '복근',
    subCategory: null,
    equipment: '맨몸',
    description: '상복부 고립 운동',
  },
  {
    name: '데드 버그',
    mainCategory: '복근',
    subCategory: '코어안정성',
    equipment: '맨몸',
    description: '코어 안정화 운동',
  },

  // 유산소 운동
  {
    name: '런닝',
    mainCategory: '유산소',
    subCategory: '하체',
    equipment: '유산소',
    description: '기본적인 유산소 운동',
  },
  {
    name: '트레드밀',
    mainCategory: '유산소',
    subCategory: '하체',
    equipment: '유산소',
    description: '실내 러닝 머신',
  },
  {
    name: '사이클',
    mainCategory: '유산소',
    subCategory: '대퇴사두',
    equipment: '유산소',
    description: '자전거를 이용한 유산소',
  },
  {
    name: '스피닝',
    mainCategory: '유산소',
    subCategory: '대퇴사두',
    equipment: '유산소',
    description: '실내 자전거 운동',
  },
  {
    name: '로잉 머신',
    mainCategory: '유산소',
    subCategory: '등',
    equipment: '유산소',
    description: '전신 유산소 운동',
  },
  {
    name: '스텝퍼',
    mainCategory: '유산소',
    subCategory: '둔근',
    equipment: '유산소',
    description: '계단 오르기 머신',
  },
  {
    name: '일립티컬',
    mainCategory: '유산소',
    subCategory: '전신',
    equipment: '유산소',
    description: '관절에 무리 없는 유산소',
  },
  {
    name: '점프 로프',
    mainCategory: '유산소',
    subCategory: '종아리',
    equipment: '유산소',
    description: '줄넘기 운동',
  },
  {
    name: '버피',
    mainCategory: '유산소',
    subCategory: '전신',
    equipment: '맨몸',
    description: '전신 고강도 운동',
  },
  {
    name: '점핑잭',
    mainCategory: '유산소',
    subCategory: '전신',
    equipment: '맨몸',
    description: '기본적인 전신 유산소',
  },
  {
    name: '박스 점프',
    mainCategory: '유산소',
    subCategory: '대퇴사두',
    equipment: '맨몸',
    description: '폭발력을 기르는 운동',
  },
  {
    name: '케틀벨 스윙',
    mainCategory: '유산소',
    subCategory: '둔근',
    equipment: '케틀벨',
    description: '힙 힌지 동작의 유산소',
  },
];

export async function seedExercises() {
  console.log('🌱 운동 종목 시드 데이터 삽입 시작...');

  try {
    // 기존 데이터 삭제 (선택사항)
    // await db.delete(exercises);

    // 데이터 삽입
    const result = await db.insert(exercises).values(exercisesData).returning();

    console.log(`✅ ${result.length}개의 운동 종목이 성공적으로 삽입되었습니다.`);
    return result;
  } catch (error) {
    console.error('❌ 시드 데이터 삽입 실패:', error);
    throw error;
  }
}

// 직접 실행 시
seedExercises()
  .then(() => {
    console.log('🎉 시드 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('시드 실패:', error);
    process.exit(1);
  });
