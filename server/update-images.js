import { query } from './src/config/database.js';

const updateMenuImages = async () => {
  try {
    console.log('🖼️ 메뉴 이미지 업데이트 시작...');
    
    // 메뉴별 이미지 URL 업데이트
    const updates = [
      { id: 1, name: '아메리카노', image: '/images/coffee1.jpg' },
      { id: 2, name: '카페 라떼', image: '/images/coffee2.jpg' },
      { id: 3, name: '카푸치노', image: '/images/coffee3.jpg' },
      { id: 4, name: '바닐라 라떼', image: '/images/coffee1.jpg' },
      { id: 5, name: '카페 모카', image: '/images/coffee2.jpg' },
      { id: 6, name: '카라멜 마키아또', image: '/images/coffee3.jpg' }
    ];

    for (const update of updates) {
      await query('UPDATE menus SET image_url = $1 WHERE menu_id = $2', [update.image, update.id]);
      console.log(`✅ 메뉴 ${update.id} (${update.name}) 이미지 업데이트: ${update.image}`);
    }
    
    console.log('🎉 모든 메뉴 이미지 업데이트 완료!');
    console.log('📝 이제 프론트엔드에서 이미지를 확인할 수 있습니다.');
  } catch (error) {
    console.error('❌ 오류:', error);
  }
  process.exit(0);
};

updateMenuImages();
