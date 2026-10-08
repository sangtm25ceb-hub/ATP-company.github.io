const toggle = document.getElementById('atp-chat-toggle');
  const panel = document.getElementById('atp-chat-panel');
  toggle.addEventListener('click', () => panel.classList.toggle('open'));

  // ===== FAQ chatbot (câu trả lời soạn sẵn, không cần API) =====
  const ATP_FAQ = [
    {
      id: 'dichvu',
      label: 'Dịch vụ',
      keywords: ['dịch vụ', 'dich vu', 'cung cấp', 'lam gi', 'làm gì', 'chuyên'],
      answer: 'ATP Automation cung cấp trọn gói: thiết kế hệ thống tự động hóa, thi công lắp đặt tủ điện điều khiển, tích hợp PLC/SCADA, robot & dây chuyền sản xuất, bảo trì bảo dưỡng định kỳ và hỗ trợ kỹ thuật khẩn cấp 24/7.'
    },
    {
      id: 'giaca',
      label: 'Báo giá',
      keywords: ['giá', 'gia ca', 'chi phí', 'chi phi', 'báo giá', 'bao gia', 'tiền', 'tien'],
      answer: 'Chi phí phụ thuộc quy mô và yêu cầu cụ thể của từng dự án nên ATP chưa thể báo giá cố định ở đây. Bạn để lại số điện thoại/email ở form bên dưới hoặc gọi hotline 0909 000 000, đội kỹ thuật sẽ khảo sát và gửi báo giá chi tiết miễn phí.'
    },
    {
      id: 'quytrinh',
      label: 'Quy trình',
      keywords: ['quy trình', 'quy trinh', 'các bước', 'cac buoc', 'triển khai'],
      answer: 'Quy trình gồm 5 bước: (1) Khảo sát hiện trạng, (2) Thiết kế bản vẽ & báo giá, (3) Thi công lắp đặt, (4) Nghiệm thu & đào tạo vận hành, (5) Bảo dưỡng dài hạn.'
    },
    {
      id: 'baotri',
      label: 'Bảo trì',
      keywords: ['bảo trì', 'bao tri', 'bảo dưỡng', 'bao duong', 'sự cố', 'su co', 'hỏng', 'hong'],
      answer: 'ATP có gói bảo trì bảo dưỡng định kỳ giúp giảm thời gian dừng máy, cùng đội kỹ thuật trực 24/7 xử lý sự cố khẩn cấp tại chỗ hoặc từ xa. Thời gian phản hồi sự cố trung bình dưới 2 giờ.'
    },
    {
      id: 'baohanh',
      label: 'Bảo hành',
      keywords: ['bảo hành', 'bao hanh'],
      answer: 'Các hạng mục thi công đều có chính sách bảo hành, thời gian cụ thể tùy loại thiết bị và hợp đồng. Bạn để lại thông tin liên hệ để được tư vấn chính sách bảo hành chi tiết cho dự án của mình nhé.'
    },
    {
      id: 'thoigian',
      label: 'Thời gian',
      keywords: ['bao lâu', 'bao lau', 'thời gian hoàn thành', 'thoi gian', 'tiến độ', 'tien do'],
      answer: 'Thời gian triển khai tùy quy mô dự án (tủ điện đơn lẻ vài ngày, dây chuyền lớn có thể vài tuần đến vài tháng). Sau khi khảo sát, ATP sẽ đưa ra tiến độ cụ thể cho bạn.'
    },
    {
      id: 'plcscada',
      label: 'PLC/SCADA',
      keywords: ['plc', 'scada', 'tích hợp', 'tich hop', 'lập trình', 'lap trinh'],
      answer: 'ATP lập trình điều khiển PLC, xây dựng giao diện giám sát SCADA và kết nối dữ liệu sản xuất theo thời gian thực, giúp bạn theo dõi và điều hành nhà máy từ xa.'
    },
    {
      id: 'robot',
      label: 'Robot',
      keywords: ['robot', 'dây chuyền', 'day chuyen', 'băng tải', 'bang tai'],
      answer: 'ATP tích hợp robot công nghiệp, băng tải, cảm biến vào dây chuyền sản xuất hiện có hoặc xây dựng dây chuyền hoàn toàn mới theo yêu cầu.'
    },
    {
      id: 'khuvuc',
      label: 'Khu vực',
      keywords: ['khu vực', 'khu vuc', 'tỉnh', 'tinh nao', 'ở đâu', 'o dau', 'toàn quốc', 'toan quoc'],
      answer: 'ATP Automation nhận triển khai dự án trên toàn quốc, văn phòng chính đặt tại Khu công nghiệp, TP. Hồ Chí Minh.'
    },
    {
      id: 'lienhe',
      label: 'Liên hệ',
      keywords: ['liên hệ', 'lien he', 'số điện thoại', 'so dien thoai', 'hotline', 'địa chỉ', 'dia chi', 'email'],
      answer: 'Hotline: 0909 000 000 (24/7) — Email: contact@atpautomation.vn — Văn phòng: Khu công nghiệp, TP. Hồ Chí Minh. Bạn cũng có thể để lại thông tin ở form bên dưới trang, ATP sẽ liên hệ lại sớm.'
    }
  ];

  const ATP_MAIN_TOPICS = ['dichvu', 'giaca', 'quytrinh', 'baotri', 'lienhe'];
  const ATP_FALLBACK = 'Mình chưa có câu trả lời sẵn cho câu hỏi này. Bạn vui lòng để lại số điện thoại ở form cuối trang hoặc gọi hotline 0909 000 000, đội kỹ thuật ATP sẽ hỗ trợ trực tiếp.';

  function atpNormalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  function atpFindAnswer(text) {
    const norm = atpNormalize(text);
    for (const item of ATP_FAQ) {
      for (const kw of item.keywords) {
        if (norm.includes(atpNormalize(kw))) return item.answer;
      }
    }
    return null;
  }

  function atpAppendMessage(role, text) {
    const body = document.getElementById('atp-chat-body');
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
    if (role !== 'user') {
      div.innerHTML = '<span class="tag">ATP SUPPORT</span>' + text;
    } else {
      div.textContent = text;
    }
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function atpRenderQuickReplies() {
    const body = document.getElementById('atp-chat-body');
    const old = document.getElementById('atp-quick-replies');
    if (old) old.remove();
    const wrap = document.createElement('div');
    wrap.id = 'atp-quick-replies';
    wrap.className = 'quick-replies';
    ATP_MAIN_TOPICS.forEach(id => {
      const item = ATP_FAQ.find(f => f.id === id);
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = item.label;
      btn.onclick = () => atpHandleUserMessage(item.label, item.answer);
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function atpShowTyping() {
    const body = document.getElementById('atp-chat-body');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'atp-typing';
    div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function atpRemoveTyping() {
    const t = document.getElementById('atp-typing');
    if (t) t.remove();
  }

  function atpHandleUserMessage(displayText, presetAnswer) {
    const old = document.getElementById('atp-quick-replies');
    if (old) old.remove();
    atpAppendMessage('user', displayText);
    atpShowTyping();
    setTimeout(() => {
      atpRemoveTyping();
      const answer = presetAnswer || atpFindAnswer(displayText) || ATP_FALLBACK;
      atpAppendMessage('bot', answer);
      atpRenderQuickReplies();
    }, 450);
  }

  function atpSendMessage() {
    const input = document.getElementById('atp-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    atpHandleUserMessage(text);
  }

  window.addEventListener('DOMContentLoaded', atpRenderQuickReplies);
  if (document.readyState !== 'loading') atpRenderQuickReplies();

  // ===== Contact form -> sends to tranmaisangg07@gmail.com via Formspree =====
  const ATP_FORM_ENDPOINT = "https://formspree.io/f/tranmaisangg07@gmail.com";

  async function atpSubmitForm() {
    const name = document.getElementById('atp-form-name').value.trim();
    const phone = document.getElementById('atp-form-phone').value.trim();
    const email = document.getElementById('atp-form-email').value.trim();
    const message = document.getElementById('atp-form-message').value.trim();
    const statusEl = document.getElementById('atp-form-status');
    const btn = document.getElementById('atp-form-submit');

    if (!name || !phone) {
      statusEl.textContent = 'Vui lòng nhập ít nhất họ tên và số điện thoại.';
      statusEl.style.color = '#ffb020';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
    statusEl.textContent = '';

    try {
      const res = await fetch(ATP_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          message: message,
          _subject: 'Yêu cầu tư vấn mới từ website ATP Automation'
        })
      });

      if (res.ok) {
        statusEl.textContent = 'Đã gửi thành công! ATP sẽ liên hệ với bạn sớm.';
        statusEl.style.color = '#34d399';
        document.getElementById('atp-form-name').value = '';
        document.getElementById('atp-form-phone').value = '';
        document.getElementById('atp-form-email').value = '';
        document.getElementById('atp-form-message').value = '';
      } else {
        throw new Error('Submit failed');
      }
    } catch (err) {
      statusEl.textContent = 'Gửi chưa thành công. Vui lòng thử lại hoặc gọi hotline 0909 000 000.';
      statusEl.style.color = '#ff6b6b';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Gửi yêu cầu tư vấn';
    }
  }
