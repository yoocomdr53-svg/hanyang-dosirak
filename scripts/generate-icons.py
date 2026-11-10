import os
import subprocess

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Background Gradient: Brand Terracotta to Deep Royal Lacquer -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C85A32"/>
      <stop offset="50%" stop-color="#AD421E"/>
      <stop offset="100%" stop-color="#7C260C"/>
    </linearGradient>

    <!-- Radial Glow behind emblem -->
    <radialGradient id="centerGlow" cx="50%" cy="45%" r="48%">
      <stop offset="0%" stop-color="#FFF0D4" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#FFA86B" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#7C260C" stop-opacity="0"/>
    </radialGradient>

    <!-- Gold Bevel Gradient -->
    <linearGradient id="goldBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE8A3"/>
      <stop offset="50%" stop-color="#E5B246"/>
      <stop offset="100%" stop-color="#A47012"/>
    </linearGradient>

    <!-- Hanok Tile Gradient -->
    <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#362E2B"/>
      <stop offset="100%" stop-color="#1A1513"/>
    </linearGradient>

    <!-- Bento Wood Lacquer Gradient -->
    <linearGradient id="bentoBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A2614"/>
      <stop offset="50%" stop-color="#31170A"/>
      <stop offset="100%" stop-color="#200E05"/>
    </linearGradient>

    <!-- Rice Gradient -->
    <radialGradient id="riceGrad" cx="40%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#F5F2EB"/>
      <stop offset="100%" stop-color="#E2DDD2"/>
    </radialGradient>

    <!-- Bulgogi Glaze Gradient -->
    <linearGradient id="bulgogiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9E4D1B"/>
      <stop offset="50%" stop-color="#6F2809"/>
      <stop offset="100%" stop-color="#421303"/>
    </linearGradient>

    <!-- Royal Seal Gradient -->
    <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E73E2E"/>
      <stop offset="100%" stop-color="#A91C12"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="shadowLarge" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
    <filter id="shadowMedium" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#FFE082" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Base App Background (Squircle Tile with safe margins) -->
  <rect width="1024" height="1024" rx="220" fill="url(#bgGrad)"/>
  <rect width="1024" height="1024" rx="220" fill="url(#centerGlow)"/>

  <!-- Elegant Inner Border / Inset Hairline -->
  <rect x="24" y="24" width="976" height="976" rx="200" fill="none" stroke="url(#goldBevel)" stroke-width="6" opacity="0.4"/>

  <!-- Korean Traditional Lattice / Dancheong subtle watermark at corners -->
  <g opacity="0.12" stroke="#FFFFFF" stroke-width="4">
    <!-- Top-left traditional geometric corner -->
    <path d="M 120 180 L 180 180 L 180 120 M 140 200 L 200 200 L 200 140" fill="none"/>
    <!-- Top-right traditional geometric corner -->
    <path d="M 904 180 L 844 180 L 844 120 M 884 200 L 824 200 L 824 140" fill="none"/>
  </g>

  <!-- ================= MAIN EMBLEM GROUP (Kept strictly within 80% safe zone: 120 to 904) ================= -->
  <g filter="url(#shadowLarge)">

    <!-- ================= 1. TRADITIONAL HANOK ROOF ================= -->
    <!-- Hanok Pillars -->
    <rect x="300" y="320" width="32" height="120" rx="6" fill="#5A2E17" stroke="#3A1C0C" stroke-width="4"/>
    <rect x="692" y="320" width="32" height="120" rx="6" fill="#5A2E17" stroke="#3A1C0C" stroke-width="4"/>

    <!-- Crossbeam (대들보) -->
    <rect x="270" y="326" width="484" height="24" rx="5" fill="#753C1E" stroke="#4A2411" stroke-width="4"/>

    <!-- Changsal Window (전통 창살) Behind Eaves -->
    <rect x="420" y="240" width="184" height="90" rx="4" fill="#FFF9ED" stroke="#5A2E17" stroke-width="8"/>
    <!-- Window grid lines -->
    <line x1="512" y1="240" x2="512" y2="330" stroke="#5A2E17" stroke-width="6"/>
    <line x1="420" y1="285" x2="604" y2="285" stroke="#5A2E17" stroke-width="6"/>
    <line x1="466" y1="240" x2="466" y2="330" stroke="#5A2E17" stroke-width="4"/>
    <line x1="558" y1="240" x2="558" y2="330" stroke="#5A2E17" stroke-width="4"/>

    <!-- Under-roof Wooden Structure -->
    <path d="M 512 145 
             Q 380 210 185 320 
             C 195 338 235 340 265 325 
             Q 385 240 512 195 
             Q 639 240 759 325 
             C 789 340 829 338 839 320 
             Q 644 210 512 145 Z" 
          fill="#442111"/>

    <!-- Main Hanok Curved Giwa Roof -->
    <path d="M 512 135 
             C 450 170 340 230 180 300 
             C 165 308 172 328 194 328 
             C 245 328 290 300 355 268 
             C 415 238 465 218 512 210 
             C 559 218 609 238 669 268 
             C 734 300 779 328 830 328 
             C 852 328 859 308 844 300 
             C 684 230 574 170 512 135 Z" 
          fill="url(#roofGrad)" stroke="#110E0C" stroke-width="6"/>

    <!-- Scalloped Pristine White Eaves Trim (기와 막새 - 전통의 상징) -->
    <path d="M 195 322 Q 225 330 255 315 Q 285 325 315 305 Q 345 315 375 292 Q 405 300 435 278 Q 465 285 495 265" 
          fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
    <path d="M 829 322 Q 799 330 769 315 Q 739 325 709 305 Q 679 315 649 292 Q 619 300 589 278 Q 559 285 529 265" 
          fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>

    <!-- Roof Ridge Top Crest (용마루 금장식) -->
    <path d="M 512 110 L 485 142 L 539 142 Z" fill="url(#goldBevel)"/>
    <circle cx="512" cy="118" r="16" fill="url(#goldBevel)" filter="url(#glow)"/>
    <rect x="472" y="136" width="80" height="12" rx="4" fill="#FFE082"/>

    <!-- ================= 2. ROYAL BENTO BOX (한양 수제 도시락) ================= -->
    <!-- Bento Box Outer Lacquer Container -->
    <rect x="232" y="375" width="560" height="375" rx="36" fill="url(#bentoBoxGrad)" stroke="url(#goldBevel)" stroke-width="12" filter="url(#shadowMedium)"/>
    <rect x="246" y="389" width="532" height="347" rx="26" fill="#180C06" stroke="#4A2614" stroke-width="4"/>

    <!-- Compartment Dividers in Rich Wood with Gold Trim -->
    <!-- Vertical divider separating Left (Rice) and Right (Dishes) -->
    <line x1="500" y1="392" x2="500" y2="733" stroke="url(#goldBevel)" stroke-width="8" stroke-linecap="round"/>
    <!-- Horizontal divider on Right side -->
    <line x1="504" y1="562" x2="774" y2="562" stroke="url(#goldBevel)" stroke-width="8" stroke-linecap="round"/>
    <!-- Vertical small divider between banchan bottom right -->
    <line x1="640" y1="566" x2="640" y2="733" stroke="url(#goldBevel)" stroke-width="8" stroke-linecap="round"/>

    <!-- COMPARTMENT 1: LEFT LARGE BOWL - Steamed Pearl White Rice (백미 햅쌀밥) -->
    <g id="rice-compartment">
      <rect x="256" y="401" width="232" height="324" rx="20" fill="url(#riceGrad)"/>
      <!-- Soft Rice Texture Grains -->
      <ellipse cx="320" cy="460" rx="14" ry="9" fill="#FFFFFF" transform="rotate(-15 320 460)"/>
      <ellipse cx="370" cy="445" rx="13" ry="8" fill="#FFFFFF" transform="rotate(25 370 445)"/>
      <ellipse cx="425" cy="470" rx="15" ry="9" fill="#FFFFFF" transform="rotate(-20 425 470)"/>
      <ellipse cx="300" cy="520" rx="14" ry="8" fill="#FFFFFF" transform="rotate(10 300 520)"/>
      <ellipse cx="430" cy="535" rx="14" ry="8" fill="#FFFFFF" transform="rotate(-10 430 535)"/>
      <ellipse cx="325" cy="625" rx="15" ry="9" fill="#FFFFFF" transform="rotate(30 325 625)"/>
      <ellipse cx="410" cy="640" rx="14" ry="8" fill="#FFFFFF" transform="rotate(-15 410 640)"/>
      <ellipse cx="365" cy="670" rx="13" ry="8" fill="#FFFFFF" transform="rotate(5 365 670)"/>

      <!-- Toasted Black Sesame Sprinkles (검은깨 고명) -->
      <g fill="#1F1A17">
        <ellipse cx="362" cy="545" rx="6.5" ry="3.5" transform="rotate(35 362 545)"/>
        <ellipse cx="380" cy="552" rx="6.5" ry="3.5" transform="rotate(-25 380 552)"/>
        <ellipse cx="355" cy="565" rx="6.5" ry="3.5" transform="rotate(70 355 565)"/>
        <ellipse cx="375" cy="572" rx="6" ry="3.2" transform="rotate(-40 375 572)"/>
        <ellipse cx="395" cy="558" rx="5.5" ry="3" transform="rotate(15 395 558)"/>
        <ellipse cx="368" cy="585" rx="6" ry="3" transform="rotate(45 368 585)"/>
      </g>
    </g>

    <!-- COMPARTMENT 2: TOP RIGHT - Royal Bulgogi & Glazed Meat (한양 궁중 불고기) -->
    <g id="bulgogi-compartment">
      <rect x="512" y="401" width="254" height="152" rx="18" fill="url(#bulgogiGrad)"/>
      <!-- Sizzling Glaze Meat Textures -->
      <path d="M 525 435 Q 560 415 605 430 T 685 420 T 750 445" stroke="#FFA726" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M 530 475 Q 585 450 640 470 T 745 465" stroke="#FF7043" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M 540 515 Q 610 495 670 515 T 740 505" stroke="#FFA726" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.75"/>
      <!-- Fresh Green Scallion Ribbons (송송 썬 실파) -->
      <rect x="580" y="435" width="22" height="7" rx="3.5" fill="#4CAF50" transform="rotate(-20 580 435)"/>
      <rect x="635" y="455" width="24" height="7" rx="3.5" fill="#66BB6A" transform="rotate(35 635 455)"/>
      <rect x="685" y="440" width="20" height="6.5" rx="3" fill="#81C784" transform="rotate(-10 685 440)"/>
      <rect x="560" y="485" width="22" height="7" rx="3.5" fill="#4CAF50" transform="rotate(15 560 485)"/>
      <rect x="650" y="495" width="24" height="7" rx="3.5" fill="#66BB6A" transform="rotate(-30 650 495)"/>
    </g>

    <!-- COMPARTMENT 3: BOTTOM RIGHT-1 - Golden Rolled Egg (명품 수제 계란말이) -->
    <g id="egg-compartment">
      <rect x="512" y="571" width="119" height="154" rx="16" fill="#FBC02D"/>
      <!-- Two thick sliced egg rolls -->
      <!-- Slice 1 -->
      <rect x="522" y="583" width="99" height="62" rx="12" fill="#FFEE58" stroke="#F57F17" stroke-width="3"/>
      <!-- Nori Seaweed Spiral in egg -->
      <path d="M 545 614 Q 571 596 595 614 Q 571 630 550 618" fill="none" stroke="#263238" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Slice 2 -->
      <rect x="522" y="653" width="99" height="62" rx="12" fill="#FFEE58" stroke="#F57F17" stroke-width="3"/>
      <path d="M 545 684 Q 571 666 595 684 Q 571 700 550 688" fill="none" stroke="#263238" stroke-width="4.5" stroke-linecap="round"/>
    </g>

    <!-- COMPARTMENT 4: BOTTOM RIGHT-2 - Royal Kimchi & Jeon Delicacies (숙성 김치 & 전통 전) -->
    <g id="side-compartment">
      <rect x="649" y="571" width="117" height="154" rx="16" fill="#C62828"/>
      <!-- Kimchi Seasoning & Cabbage Leaves -->
      <path d="M 660 595 C 685 580 720 590 745 610" stroke="#FF5722" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M 658 635 C 690 620 725 635 750 655" stroke="#E64A19" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M 662 675 C 695 660 728 675 748 695" stroke="#FF7043" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Green garnish -->
      <circle cx="700" cy="640" r="5" fill="#4CAF50"/>
      <circle cx="715" cy="648" r="4" fill="#81C784"/>
    </g>

    <!-- Chopsticks Rest Accent (수저와 젓가락 상징) -->
    <g opacity="0.95">
      <line x1="260" y1="710" x2="480" y2="710" stroke="#E5B246" stroke-width="3.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- ================= 3. ROYAL BRAND TYPOGRAPHY / TITLE BADGE ================= -->
  <!-- Dignified Korean Calligraphy Title Pill at Bottom -->
  <g filter="url(#shadowLarge)">
    <!-- Elegant Maroon/Gold Badge -->
    <rect x="230" y="785" width="564" height="150" rx="38" fill="#1C1410" stroke="url(#goldBevel)" stroke-width="8"/>
    
    <!-- Red Royal Artist Seal Stamp on the Left (한양 직인 낙관) -->
    <g transform="translate(258, 808)">
      <rect x="0" y="0" width="104" height="104" rx="18" fill="url(#sealGrad)" stroke="url(#goldBevel)" stroke-width="5" filter="url(#shadowMedium)"/>
      <text x="52" y="44" font-family="'Noto Sans KR', 'Song Myung', serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">漢</text>
      <text x="52" y="85" font-family="'Noto Sans KR', 'Song Myung', serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">陽</text>
    </g>

    <!-- Main Korean Typography: 한양도시락 -->
    <!-- "한양" in Majestic Gold -->
    <text x="390" y="888" font-family="'Gowun Batang', 'Song Myung', 'Noto Sans KR', serif" font-weight="900" font-size="82" fill="url(#goldBevel)" letter-spacing="4">한양</text>
    
    <!-- "도시락" in Crisp Pure White with subtle gold shadow -->
    <text x="568" y="888" font-family="'Gowun Batang', 'Song Myung', 'Noto Sans KR', serif" font-weight="900" font-size="76" fill="#FFFFFF" letter-spacing="3">도시락</text>

    <!-- English Subtitle Underneath: PREMIUM KOREAN BENTO -->
    <text x="585" y="828" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="19" fill="#F5E6CC" opacity="0.9" letter-spacing="6">PREMIUM KOREAN BENTO</text>
  </g>
</svg>
'''

with open('public/app-icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Created public/app-icon.svg successfully!")
