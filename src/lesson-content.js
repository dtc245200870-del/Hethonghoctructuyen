module.exports = {
  "web-01": {
    introduction: "Bài học đặt nền tảng cho hành trình làm web: hiểu trang web được tạo ra như thế nào, công cụ nào tham gia và cách biến một ý tưởng thành sản phẩm có thể mở trên trình duyệt.",
    sections: [
      {
        heading: "Trang web hoạt động ra sao?",
        paragraphs: [
          "Khi nhập một địa chỉ vào trình duyệt, trình duyệt gửi yêu cầu đến máy chủ. Máy chủ trả về các tài nguyên như HTML, CSS, JavaScript và hình ảnh. Trình duyệt đọc những tài nguyên đó rồi dựng thành trang mà bạn nhìn thấy.",
          "HTML mô tả nội dung và cấu trúc, CSS quyết định cách trình bày, còn JavaScript xử lý những hành động có tương tác. Ba công nghệ thường phối hợp với nhau nhưng đảm nhiệm những vai trò khác nhau."
        ]
      },
      {
        heading: "Tư duy trước khi viết mã",
        paragraphs: [
          "Hãy bắt đầu bằng việc xác định người dùng cần làm gì, thông tin nào cần xuất hiện và các phần nào của trang liên quan với nhau. Chia giao diện thành những khối nhỏ giúp ta xây dựng, kiểm tra và sửa từng phần dễ hơn.",
          "Một quy trình thực tế là phác thảo bố cục, tạo cấu trúc HTML, bổ sung kiểu dáng CSS, rồi thêm tương tác bằng JavaScript. Sau mỗi bước, mở trang trong trình duyệt và kiểm tra kết quả thay vì chờ đến khi hoàn tất toàn bộ."
        ],
        bullets: [
          "Nội dung đúng và có cấu trúc là nền tảng trước khi trang trí.",
          "Tên tệp, tên biến và thụt lề nhất quán giúp dự án dễ đọc.",
          "Khi có lỗi, kiểm tra thông báo trong Console và sửa từng nguyên nhân."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Hãy quan sát một trang bạn thường sử dụng và liệt kê các vùng như đầu trang, điều hướng, nội dung chính và chân trang. Thử đoán vùng nào là nội dung HTML, vùng nào là cách trình bày CSS và hành động nào cần JavaScript.",
          "Trong các bài tiếp theo, bạn sẽ tạo một trang HTML thật, định dạng nó bằng CSS và thêm tương tác. Mục tiêu không phải ghi nhớ mọi cú pháp ngay lập tức mà là hiểu vai trò của từng phần và biết cách kiểm tra kết quả."
        ]
      }
    ]
  },
  "web-02": {
    introduction: "HTML (HyperText Markup Language) dùng các phần tử để mô tả ý nghĩa và cấu trúc nội dung. Trình duyệt dựa vào cấu trúc này để hiển thị trang; công cụ hỗ trợ cũng dựa vào đó để hiểu trang.",
    sections: [
      {
        heading: "Khung tài liệu HTML",
        paragraphs: [
          "Một tài liệu thường bắt đầu bằng khai báo doctype, tiếp theo là phần tử html. Bên trong html có head chứa thông tin về tài liệu và body chứa nội dung hiển thị. Thuộc tính lang nên phản ánh ngôn ngữ chính, ví dụ vi cho tiếng Việt.",
          "Trong head, thẻ title đặt tên trên tab trình duyệt; meta charset UTF-8 giúp văn bản tiếng Việt được đọc đúng; thẻ viewport hỗ trợ bố cục trên điện thoại. Các thẻ này không thay thế nội dung trong body."
        ]
      },
      {
        heading: "Phần tử và ngữ nghĩa",
        paragraphs: [
          "Phần tử HTML thường có thẻ mở, nội dung và thẻ đóng. Ví dụ, h1 đánh dấu tiêu đề chính, p đánh dấu đoạn văn và a tạo liên kết. Một số phần tử như img và input không có thẻ đóng theo cách thông thường.",
          "Chọn thẻ theo ý nghĩa thay vì chọn chỉ vì hình thức. Dùng header cho phần đầu, nav cho điều hướng, main cho nội dung chính, section cho một nhóm nội dung có chủ đề và footer cho phần cuối. Mỗi trang thường chỉ nên có một tiêu đề h1 chính."
        ],
        bullets: [
          "Dùng h1 đến h6 theo cấp bậc tiêu đề, không chọn cấp chỉ để đổi cỡ chữ.",
          "Liên kết cần mô tả rõ nơi sẽ mở; nút dành cho hành động.",
          "Ảnh có nội dung nên có văn bản thay thế alt phù hợp."
        ]
      },
      {
        heading: "Thuộc tính và biểu mẫu",
        paragraphs: [
          "Thuộc tính bổ sung thông tin cho phần tử, chẳng hạn href trên liên kết, src và alt trên ảnh, hoặc type và name trên ô nhập liệu. Giá trị thuộc tính cần đặt trong dấu nháy để tránh lỗi khi có khoảng trắng.",
          "Biểu mẫu dùng label để gắn nhãn dễ hiểu cho từng input. Thuộc tính for của label cần trùng với id của input; với các biểu mẫu đơn giản, đặt input bên trong label cũng tạo mối liên kết rõ ràng."
        ]
      },
      {
        heading: "Thực hành và kiểm tra",
        paragraphs: [
          "Tạo một tệp index.html có tiêu đề, một đoạn giới thiệu, danh sách ba mục và liên kết đến một trang khác. Mở tệp bằng trình duyệt, sau đó dùng Inspect để xem cây phần tử.",
          "Kiểm tra rằng thẻ được lồng đúng thứ tự, tiêu đề có cấp bậc hợp lý và mọi hình ảnh có alt. Nếu cấu trúc sai, trình duyệt đôi khi vẫn hiển thị trang nhưng các công cụ hỗ trợ có thể hiểu nội dung không đúng."
        ]
      }
    ]
  },
  "web-03": {
    introduction: "CSS (Cascading Style Sheets) điều khiển màu sắc, khoảng cách, kiểu chữ và cách bố trí phần tử. Bài học này giới thiệu quy tắc CSS, độ ưu tiên và những công cụ bố cục thường dùng.",
    sections: [
      {
        heading: "Quy tắc CSS và bộ chọn",
        paragraphs: [
          "Một quy tắc CSS gồm bộ chọn và khối khai báo. Bộ chọn xác định phần tử cần định dạng; trong khối, mỗi khai báo gồm một thuộc tính và giá trị, kết thúc bằng dấu chấm phẩy.",
          "Bộ chọn theo tên thẻ áp dụng cho mọi thẻ cùng loại; dấu chấm chọn class và dấu thăng chọn id. Class phù hợp để tái sử dụng kiểu dáng trên nhiều phần tử, còn id thường dành cho một định danh duy nhất."
        ]
      },
      {
        heading: "Cách trình duyệt chọn kiểu",
        paragraphs: [
          "Tên gọi cascading mô tả cách trình duyệt kết hợp nhiều quy tắc. Nếu nhiều quy tắc cùng áp dụng, độ đặc hiệu của bộ chọn và thứ tự khai báo giúp quyết định giá trị cuối cùng. Tránh lạm dụng !important vì nó làm việc truy tìm nguồn gốc kiểu dáng khó hơn.",
          "CSS kế thừa một số thuộc tính như màu chữ và font từ phần tử cha. Khi một kiểu không như mong đợi, kiểm tra tab Computed trong công cụ phát triển để biết quy tắc nào đang thắng."
        ]
      },
      {
        heading: "Box model và bố cục",
        paragraphs: [
          "Mỗi phần tử dạng hộp có nội dung, padding, border và margin. Padding tạo khoảng trống phía trong đường viền; margin tạo khoảng cách bên ngoài. Quy tắc box-sizing: border-box thường giúp kích thước khai báo dễ dự đoán hơn.",
          "Flexbox phù hợp với bố cục một chiều, như căn các nút trên một hàng. CSS Grid phù hợp khi cần hàng và cột. Dùng gap để tạo khoảng cách nhất quán giữa các phần tử thay vì thêm margin riêng cho từng mục."
        ],
        bullets: [
          "Dùng đơn vị tương đối như %, rem hoặc fr khi bố cục cần co giãn.",
          "Media query giúp điều chỉnh bố cục ở màn hình nhỏ.",
          "Kiểm tra độ tương phản để văn bản dễ đọc."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Tạo một thẻ giới thiệu có tiêu đề, mô tả và nút. Dùng Grid hoặc Flexbox để sắp xếp, thêm padding để nội dung thoáng và dùng màu nền nhẹ để phân biệt thẻ với trang.",
          "Thu nhỏ cửa sổ trình duyệt để kiểm tra bố cục. Nếu xuất hiện cuộn ngang, tìm phần tử có chiều rộng cố định quá lớn và thay bằng kích thước linh hoạt."
        ]
      }
    ]
  },
  "web-04": {
    introduction: "JavaScript giúp trang web phản hồi thao tác của người dùng. Bài học giới thiệu biến, hàm, DOM và sự kiện qua ví dụ cập nhật nội dung khi nhấn nút.",
    sections: [
      {
        heading: "Biến, giá trị và hàm",
        paragraphs: [
          "Dùng const cho tham chiếu không cần gán lại và let khi giá trị sẽ thay đổi. Các kiểu dữ liệu thường gặp gồm chuỗi, số, boolean, null, undefined, mảng và object.",
          "Hàm gom một thao tác có tên để gọi lại khi cần. Hàm có thể nhận tham số và trả kết quả. Chia chương trình thành các hàm nhỏ giúp mỗi phần dễ hiểu và dễ kiểm tra."
        ]
      },
      {
        heading: "Tương tác với DOM",
        paragraphs: [
          "DOM là biểu diễn dạng cây của tài liệu HTML. JavaScript có thể tìm phần tử bằng các phương thức như querySelector, sau đó đọc hoặc cập nhật nội dung, thuộc tính và class.",
          "Khi đưa dữ liệu chữ lên trang, textContent thường là lựa chọn an toàn vì nó hiển thị văn bản như văn bản. Tránh ghép dữ liệu người dùng vào innerHTML nếu không có cơ chế làm sạch phù hợp."
        ]
      },
      {
        heading: "Sự kiện và thao tác bất đồng bộ",
        paragraphs: [
          "Sự kiện click, submit và input cho phép phản hồi thao tác. addEventListener đăng ký hàm xử lý mà không cần viết mã JavaScript trực tiếp trong HTML. Với biểu mẫu, preventDefault có thể ngăn hành vi tải lại mặc định để ứng dụng xử lý dữ liệu.",
          "fetch gửi yêu cầu mạng và trả về Promise. Kiểm tra response.ok trước khi dùng dữ liệu, đồng thời xử lý lỗi để giao diện có thể thông báo rõ ràng thay vì dừng im lặng."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Tạo một nút và một vùng hiển thị số đếm. Mỗi lần nhấn, tăng biến đếm rồi cập nhật textContent của vùng đó. Sau đó thử thêm nút đặt lại và kiểm tra hành vi khi nhấn liên tiếp.",
          "Nếu thao tác không chạy, mở Console để kiểm tra lỗi cú pháp hoặc phần tử không tìm thấy. Thẻ script thường được đặt với defer hoặc đặt cuối body để HTML sẵn sàng trước khi mã truy cập DOM."
        ]
      }
    ]
  },
  "py-01": {
    introduction: "Python là ngôn ngữ dễ đọc, phù hợp để tự động hóa, phát triển ứng dụng và phân tích dữ liệu. Bài học hướng dẫn chuẩn bị môi trường và chạy chương trình đầu tiên.",
    sections: [
      {
        heading: "Chọn môi trường Python",
        paragraphs: [
          "Cài đặt Python từ nguồn phân phối phù hợp với hệ điều hành của bạn. Trên Windows, có thể dùng Python Launcher để chọn phiên bản; trên macOS hoặc Linux, kiểm tra lệnh python3. Không nên thay thế Python hệ thống nếu hệ điều hành đang phụ thuộc vào nó.",
          "Chạy python --version hoặc python3 --version trong terminal để xác nhận trình thông dịch. Nếu lệnh chưa được nhận diện, kiểm tra đường dẫn cài đặt và tùy chọn thêm Python vào PATH."
        ]
      },
      {
        heading: "Chương trình và terminal",
        paragraphs: [
          "Tạo tệp hello.py và viết lệnh print để hiển thị một dòng. Trong terminal, chuyển đến thư mục chứa tệp rồi chạy python hello.py hoặc python3 hello.py tùy cấu hình.",
          "Terminal hiển thị kết quả và thông báo lỗi. Đọc dòng cuối của traceback trước, sau đó lần theo tên tệp và số dòng để tìm vị trí xảy ra vấn đề."
        ]
      },
      {
        heading: "Môi trường ảo và gói thư viện",
        paragraphs: [
          "Mỗi dự án có thể cần các phiên bản thư viện khác nhau. Virtual environment tạo một môi trường Python riêng để cài phụ thuộc mà không làm ảnh hưởng các dự án khác.",
          "Tạo môi trường bằng python -m venv .venv, kích hoạt theo hệ điều hành, rồi cài gói bằng pip. Ghi lại các phụ thuộc để dự án có thể được thiết lập lại ở một máy khác."
        ],
        bullets: [
          "Mỗi dự án nên có thư mục riêng và tên tệp dễ hiểu.",
          "Không cài gói vào môi trường toàn cục khi dự án cần các phiên bản độc lập.",
          "Kiểm tra chính sách terminal nếu hệ điều hành chặn kích hoạt script."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Viết chương trình in lời chào và phiên bản Python. Sửa chuỗi lời chào, chạy lại và quan sát cách kết quả thay đổi.",
          "Sau đó tạo môi trường ảo cho thư mục dự án. Thử kiểm tra phiên bản pip và cài một thư viện nhỏ chỉ khi bài tập cần đến thư viện đó."
        ]
      }
    ]
  },
  "py-02": {
    introduction: "Biến đặt tên cho dữ liệu để chương trình có thể sử dụng lại. Bài học giới thiệu kiểu dữ liệu cơ bản, phép toán, chuyển đổi và cách nhận dữ liệu từ người dùng.",
    sections: [
      {
        heading: "Biến và quy tắc đặt tên",
        paragraphs: [
          "Dùng dấu bằng để gán giá trị cho một tên. Tên biến nên mô tả mục đích, bắt đầu bằng chữ cái hoặc dấu gạch dưới và không trùng từ khóa Python. Theo quy ước phổ biến, tên biến dùng chữ thường và dấu gạch dưới giữa các từ.",
          "Python xác định kiểu dữ liệu từ giá trị được gán. Có thể dùng type để kiểm tra kiểu trong lúc học, nhưng trong chương trình thực tế hãy ưu tiên đặt tên rõ ràng và kiểm soát dữ liệu đầu vào."
        ]
      },
      {
        heading: "Kiểu dữ liệu và phép toán",
        paragraphs: [
          "Các kiểu cơ bản gồm int cho số nguyên, float cho số thập phân, str cho văn bản và bool cho đúng/sai. Cộng, trừ, nhân và chia có các toán tử tương ứng; // chia lấy phần nguyên, % lấy phần dư và ** tính lũy thừa.",
          "Chuỗi có thể nối với nhau, nhưng không thể cộng trực tiếp chuỗi với số. Dùng str, int hoặc float để chuyển đổi một cách có chủ đích; luôn cân nhắc dữ liệu nhập vào có hợp lệ hay không."
        ],
        bullets: [
          "input luôn trả về chuỗi, kể cả khi người dùng gõ chữ số.",
          "Dùng f-string để chèn giá trị vào câu văn dễ đọc.",
          "So sánh tạo ra giá trị boolean và dùng == để so sánh bằng."
        ]
      },
      {
        heading: "Điều kiện và lỗi nhập liệu",
        paragraphs: [
          "if, elif và else cho phép chọn nhánh thực thi dựa trên điều kiện. Các biểu thức and, or và not kết hợp điều kiện. Thụt lề là một phần cú pháp bắt buộc của Python.",
          "Khi chuyển dữ liệu nhập sang số, đầu vào không hợp lệ có thể gây ValueError. Trong ứng dụng cần thiết, dùng try/except cụ thể để yêu cầu người dùng nhập lại thay vì để chương trình kết thúc bất ngờ."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Viết chương trình hỏi tên và năm sinh, sau đó in lời chào. Chuyển năm sinh sang số nguyên trước khi tính toán và kiểm tra trường hợp người dùng nhập ký tự không phải số.",
          "Thử thêm điều kiện để hiển thị một thông báo khác nhau tùy theo giá trị. Dùng tên biến mô tả và chạy thử nhiều bộ dữ liệu, kể cả dữ liệu trống hoặc không hợp lệ."
        ]
      }
    ]
  },
  "py-03": {
    introduction: "Vòng lặp giúp thực hiện lại một thao tác; list, tuple, set và dictionary lưu trữ nhóm dữ liệu theo cách khác nhau. Bài học chọn đúng cấu trúc sẽ làm chương trình rõ ràng hơn.",
    sections: [
      {
        heading: "Vòng lặp for và while",
        paragraphs: [
          "for duyệt lần lượt qua các phần tử của một dãy hoặc đối tượng có thể lặp. Hàm range tạo dãy số, thường dùng để lặp một số lần xác định; điểm cuối của range không được bao gồm.",
          "while tiếp tục chạy khi điều kiện còn đúng. Cần đảm bảo trạng thái sẽ thay đổi để vòng lặp có thể kết thúc. break thoát vòng lặp và continue bỏ qua phần còn lại của lượt hiện tại."
        ]
      },
      {
        heading: "List và tuple",
        paragraphs: [
          "List là dãy có thứ tự và có thể thay đổi. Truy cập phần tử bằng chỉ số bắt đầu từ 0; append thêm phần tử và len trả số lượng. Duyệt trực tiếp từng phần tử thường rõ hơn việc tự quản lý chỉ số.",
          "Tuple cũng có thứ tự nhưng thường dùng cho nhóm giá trị không cần sửa sau khi tạo. Việc chọn tuple hay list nên phản ánh ý nghĩa dữ liệu, không chỉ để tối ưu."
        ]
      },
      {
        heading: "Set và dictionary",
        paragraphs: [
          "Set lưu các giá trị không trùng lặp và hữu ích khi cần kiểm tra thành viên hoặc loại trùng. Dictionary ánh xạ khóa đến giá trị, ví dụ mã sản phẩm đến tên sản phẩm.",
          "Khi truy cập khóa không chắc chắn tồn tại, dùng get hoặc kiểm tra khóa trước. Dữ liệu có thể lồng nhau, nhưng cấu trúc quá sâu sẽ khó hiểu; hãy chọn cách lưu đơn giản nhất đáp ứng bài toán."
        ],
        bullets: [
          "Dùng list khi cần thứ tự và cho phép giá trị lặp.",
          "Dùng set khi cần loại trùng hoặc kiểm tra thành viên.",
          "Dùng dictionary khi cần tra cứu theo khóa có ý nghĩa."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Tạo danh sách điểm số, tính số lượng và điểm trung bình. Sau đó dùng vòng lặp để đếm bao nhiêu điểm đạt một ngưỡng do bạn chọn.",
          "Thử chuyển danh sách thành set để nhận biết giá trị trùng lặp. Với dữ liệu dạng tên và điểm, dùng dictionary để tra cứu điểm theo tên."
        ]
      }
    ]
  },
  "py-04": {
    introduction: "Bài học kết hợp biến, điều kiện, vòng lặp và cấu trúc dữ liệu để tạo một ứng dụng dòng lệnh nhỏ. Mục tiêu là biến yêu cầu thành các bước có thể kiểm tra.",
    sections: [
      {
        heading: "Phân tích yêu cầu",
        paragraphs: [
          "Trước khi viết mã, mô tả chương trình cần làm gì, người dùng nhập dữ liệu nào và kết quả phải hiển thị ra sao. Chia ứng dụng thành những hành động nhỏ như xem danh sách, thêm mục và kết thúc.",
          "Tách dữ liệu khỏi luồng điều khiển. Một list hoặc dictionary có thể lưu dữ liệu trong lúc chương trình chạy; hàm có tên rõ ràng thực hiện từng hành động."
        ]
      },
      {
        heading: "Tổ chức chương trình",
        paragraphs: [
          "Tạo vòng lặp menu, đọc lựa chọn rồi dùng if/elif để gọi chức năng phù hợp. Hàm giúp tránh lặp mã và làm cho phần điều phối chương trình dễ đọc.",
          "Kiểm tra dữ liệu đầu vào trước khi dùng. Với thao tác có thể thất bại, báo lỗi cụ thể và giữ chương trình hoạt động để người dùng có thể thử lại."
        ]
      },
      {
        heading: "Kiểm thử và cải thiện",
        paragraphs: [
          "Thử luồng bình thường, lựa chọn không hợp lệ, danh sách còn trống và dữ liệu biên. Mỗi trường hợp giúp phát hiện một loại vấn đề khác nhau.",
          "Khi chương trình hoạt động, xem lại tên biến, độ dài hàm và phần mã lặp. Nếu dữ liệu cần giữ sau khi thoát, có thể học thêm cách đọc/ghi tệp ở bài tiếp theo; không nên thêm lưu trữ phức tạp khi chưa cần."
        ],
        bullets: [
          "Mỗi hàm nên có một trách nhiệm chính.",
          "Kiểm tra đầu vào tại nơi tiếp nhận dữ liệu.",
          "Chạy lại các trường hợp cũ sau khi sửa mã."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Xây dựng một danh sách việc cần làm trong terminal: thêm việc, xem danh sách, đánh dấu hoặc xóa việc và thoát. Có thể dùng list các dictionary để giữ tên việc và trạng thái.",
          "Ghi lại các trường hợp đã thử. Nếu một thao tác làm thay đổi dữ liệu sai, tạo ví dụ nhỏ nhất có thể tái hiện lỗi rồi sửa và kiểm thử lại."
        ]
      }
    ]
  },
  "ui-01": {
    introduction: "UI là phần giao diện người dùng nhìn và thao tác; UX là trải nghiệm tổng thể khi họ cố gắng đạt mục tiêu. Thiết kế tốt bắt đầu từ nhu cầu và bối cảnh của người dùng, không chỉ từ màu sắc.",
    sections: [
      {
        heading: "UI và UX bổ trợ nhau",
        paragraphs: [
          "Một giao diện đẹp nhưng khó tìm chức năng vẫn tạo trải nghiệm kém. Ngược lại, luồng dễ hiểu nhưng chữ khó đọc hoặc nút khó nhấn cũng gây trở ngại. UI là một phần của UX chứ không phải hai khái niệm thay thế nhau.",
          "Hãy mô tả mục tiêu người dùng bằng động từ cụ thể, chẳng hạn tìm khóa học, đăng ký hoặc xem tiến độ. Mục tiêu này giúp đánh giá từng màn hình có hỗ trợ đúng việc cần làm hay không."
        ]
      },
      {
        heading: "Hiểu người dùng và bối cảnh",
        paragraphs: [
          "Người dùng có thiết bị, mức độ quen thuộc công nghệ, khả năng tiếp cận và môi trường sử dụng khác nhau. Câu hỏi nghiên cứu nên tìm hiểu họ đang làm gì, trở ngại nào xuất hiện và cách họ giải quyết hiện tại.",
          "Tránh coi giả định của nhóm thiết kế là dữ kiện. Phỏng vấn ngắn, quan sát thao tác và thử nguyên mẫu có thể phát hiện khác biệt giữa điều người dùng nói và điều họ thực sự cần."
        ],
        bullets: [
          "Nêu vấn đề bằng góc nhìn người dùng.",
          "Tách dữ kiện quan sát được khỏi giả định.",
          "Ưu tiên giải quyết trở ngại ảnh hưởng trực tiếp đến mục tiêu."
        ]
      },
      {
        heading: "Nguyên tắc giao diện rõ ràng",
        paragraphs: [
          "Tính nhất quán giúp người dùng dự đoán các nút và thành phần sẽ hoạt động ra sao. Thứ bậc thị giác dùng kích thước, khoảng cách và tương phản để làm rõ nội dung quan trọng trước.",
          "Phản hồi sau thao tác cho người dùng biết hệ thống đã nhận hành động. Thông báo cần dễ hiểu, có hướng xử lý và không chỉ dựa vào màu sắc để truyền tải trạng thái."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Chọn một tác vụ trên ứng dụng quen thuộc và ghi lại các bước, điểm gây bối rối cùng thông tin người dùng cần tại mỗi bước. Đề xuất một thay đổi nhỏ có thể kiểm chứng.",
          "Viết tiêu chí thành công có thể quan sát, ví dụ người dùng tìm thấy nút đăng ký mà không cần gợi ý. Tiêu chí cụ thể giúp kiểm tra thiết kế thay vì chỉ hỏi người dùng có thích hay không."
        ]
      }
    ]
  },
  "ui-02": {
    introduction: "Nghiên cứu người dùng giúp hiểu vấn đề trước khi đầu tư vào giao diện chi tiết. Wireframe biến ý tưởng thành bố cục đơn giản để đánh giá cấu trúc và luồng thao tác sớm.",
    sections: [
      {
        heading: "Đặt câu hỏi nghiên cứu",
        paragraphs: [
          "Bắt đầu từ điều nhóm chưa biết và cần quyết định. Câu hỏi mở như “Bạn thường làm gì khi tìm một khóa học?” khuyến khích kể lại trải nghiệm; câu hỏi dẫn dắt có thể làm câu trả lời thiên về giả định của người hỏi.",
          "Hỏi về hành vi gần đây và ví dụ cụ thể thay vì chỉ hỏi người tham gia muốn tính năng nào. Ghi lại bối cảnh, mục tiêu, khó khăn và cách họ xử lý."
        ]
      },
      {
        heading: "Tổng hợp phát hiện",
        paragraphs: [
          "Sau khi thu thập thông tin, nhóm các quan sát có điểm chung và phân biệt chúng với suy đoán. Tìm các nhu cầu lặp lại, điểm thất bại và ngoại lệ đáng chú ý.",
          "Một tuyên bố vấn đề tốt mô tả ai gặp trở ngại gì và vì sao điều đó quan trọng. Tránh nhảy thẳng sang một giải pháp cụ thể trước khi hiểu nguyên nhân."
        ]
      },
      {
        heading: "Từ luồng đến wireframe",
        paragraphs: [
          "Liệt kê các bước người dùng cần thực hiện, sau đó vẽ màn hình hỗ trợ từng bước. Wireframe tập trung vào vùng nội dung, thứ bậc thông tin và hành động chính; không cần dành nhiều thời gian cho màu sắc hay hình ảnh.",
          "Dùng giấy hoặc công cụ số đều được. Gắn nhãn các nút, trường nhập và trạng thái lỗi để người khác có thể hiểu luồng mà không cần người thiết kế giải thích thêm."
        ],
        bullets: [
          "Một màn hình nên có mục tiêu và hành động chính dễ nhận biết.",
          "Thể hiện trạng thái trống, tải và lỗi khi chúng ảnh hưởng luồng.",
          "Kiểm tra luồng bằng một nhiệm vụ thực tế, không chỉ xem từng màn hình riêng."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Vẽ luồng tìm một khóa học, xem chi tiết rồi đăng ký. Đánh dấu thông tin người học cần trước khi quyết định và phản hồi cần xuất hiện sau khi đăng ký.",
          "Đưa wireframe cho một người khác xem và nhờ họ thực hiện nhiệm vụ. Ghi lại chỗ họ dừng hoặc hiểu sai; dùng phát hiện đó để sửa bố cục."
        ]
      }
    ]
  },
  "ui-03": {
    introduction: "Màu sắc và kiểu chữ không chỉ tạo phong cách mà còn giúp tổ chức thông tin. Một hệ thống thiết kế nhỏ làm giao diện nhất quán và dễ mở rộng.",
    sections: [
      {
        heading: "Màu sắc có vai trò",
        paragraphs: [
          "Chọn màu nền, màu chữ, màu nhấn và màu trạng thái với mục đích rõ ràng. Dùng màu nhấn cho hành động quan trọng một cách tiết chế; nếu mọi thứ đều nổi bật thì không còn thứ bậc.",
          "Đảm bảo độ tương phản chữ và nền đáp ứng khả năng đọc. Không dùng màu đơn độc để chỉ lỗi, thành công hay lựa chọn; thêm nhãn, biểu tượng hoặc hình dạng để thông tin vẫn rõ với nhiều người dùng."
        ]
      },
      {
        heading: "Thang kiểu chữ",
        paragraphs: [
          "Chọn một hoặc hai họ chữ dễ đọc, sau đó xác định các cấp tiêu đề, nội dung và chú thích. Kích thước, độ đậm, chiều cao dòng và khoảng cách cùng nhau tạo nên khả năng đọc.",
          "Dùng các giá trị lặp lại có chủ đích thay vì chỉnh từng thành phần tùy ý. Trên màn hình nhỏ, thân chữ quá bé và dòng quá dài sẽ làm người đọc mệt."
        ]
      },
      {
        heading: "Token và tính nhất quán",
        paragraphs: [
          "Design token là tên dùng chung cho giá trị màu, khoảng cách, bo góc hoặc kiểu chữ. Ví dụ, màu hành động chính có thể được tham chiếu bằng một tên duy nhất, giúp thay đổi toàn hệ thống dễ hơn.",
          "Tạo một bảng mẫu gồm màu, cấp chữ, nút và trường nhập. Kiểm tra cả trạng thái bình thường, hover, focus, disabled và lỗi trước khi áp dụng cho nhiều màn hình."
        ],
        bullets: [
          "Giữ bảng màu gọn và phân biệt màu chức năng với màu trang trí.",
          "Có trạng thái focus nhìn thấy được khi dùng bàn phím.",
          "Kiểm tra nội dung dài để tránh tràn hoặc cắt chữ."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Tạo bảng màu và thang kiểu chữ cho trang khóa học. Dùng cùng token để định dạng tiêu đề, mô tả, nút chính và thông báo.",
          "Thử xem trang ở độ sáng thấp, phóng to chữ và dùng bàn phím. Những kiểm tra này có thể phát hiện vấn đề không thấy khi chỉ nhìn bản thiết kế ở kích thước chuẩn."
        ]
      }
    ]
  },
  "ui-04": {
    introduction: "Prototype mô phỏng một phần sản phẩm để kiểm tra luồng và ý tưởng trước khi phát triển đầy đủ. Figma hỗ trợ liên kết màn hình, vùng tương tác và phản hồi trong một bản thử nghiệm.",
    sections: [
      {
        heading: "Chuẩn bị các màn hình",
        paragraphs: [
          "Tạo một frame cho mỗi màn hình hoặc trạng thái cần kiểm tra. Đặt tên rõ ràng, sắp xếp theo luồng từ trái sang phải và tái sử dụng component cho những phần xuất hiện nhiều lần.",
          "Prototype không cần đầy đủ mọi chi tiết. Ưu tiên những màn hình giúp kiểm tra giả thuyết quan trọng như tìm kiếm, xem chi tiết hoặc hoàn tất đăng ký."
        ]
      },
      {
        heading: "Tạo tương tác",
        paragraphs: [
          "Trong chế độ Prototype, nối vùng tương tác với màn hình đích và chọn hành động phù hợp, chẳng hạn nhấn để điều hướng. Kiểm tra điểm bắt đầu để người xem mở đúng màn hình đầu tiên.",
          "Dùng overlay hoặc biến thể component khi cần minh họa menu hay trạng thái. Giữ hành vi nhất quán để người thử tập trung vào tác vụ thay vì đoán cách điều khiển prototype."
        ]
      },
      {
        heading: "Thử nghiệm và ghi nhận",
        paragraphs: [
          "Đưa cho người thử một nhiệm vụ cụ thể nhưng không hướng dẫn từng lần nhấn. Quan sát nơi họ tìm kiếm, lựa chọn và dừng lại; hỏi họ nghĩ điều gì sẽ xảy ra trước khi gợi ý.",
          "Prototype chỉ mô phỏng một phần sản phẩm, vì vậy cần nói rõ điều gì chưa hoạt động thật. Ghi nhận phản hồi theo mức độ ảnh hưởng đến mục tiêu và quyết định thay đổi có thể kiểm chứng."
        ],
        bullets: [
          "Tạo luồng tối thiểu để trả lời một câu hỏi thiết kế.",
          "Đặt tên layer và component dễ tìm.",
          "Kiểm tra liên kết màn hình trước khi chia sẻ."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Tạo prototype ba màn hình: danh sách khóa học, chi tiết khóa học và trạng thái đăng ký thành công. Nối các nút để người thử hoàn thành tác vụ.",
          "Thử luồng với một người khác, ghi lại điểm họ chọn sai hoặc không hiểu, rồi sửa một vấn đề rõ nhất. Chạy thử lại để xem thay đổi có cải thiện khả năng hoàn thành nhiệm vụ không."
        ]
      }
    ]
  },
  "sql-01": {
    introduction: "Cơ sở dữ liệu quan hệ lưu thông tin trong các bảng có cấu trúc. Bài học giới thiệu hàng, cột, khóa và cách mô hình hóa mối quan hệ giữa các thực thể.",
    sections: [
      {
        heading: "Bảng, hàng và cột",
        paragraphs: [
          "Bảng mô tả một loại thực thể, chẳng hạn học viên hoặc khóa học. Mỗi cột có tên và kiểu dữ liệu; mỗi hàng là một bản ghi. Thiết kế cột rõ ràng giúp dữ liệu nhất quán và truy vấn dễ hơn.",
          "Chọn kiểu dữ liệu phù hợp với ý nghĩa: số nguyên cho số đếm, ngày giờ cho thời điểm và chuỗi cho văn bản. Tránh lưu nhiều giá trị không liên quan trong một cột nếu cần tìm kiếm hoặc kiểm tra riêng."
        ]
      },
      {
        heading: "Khóa chính và khóa ngoại",
        paragraphs: [
          "Khóa chính nhận diện duy nhất mỗi hàng và không được trùng. Khóa ngoại tham chiếu đến khóa ở bảng khác, tạo mối quan hệ và giúp cơ sở dữ liệu kiểm tra tính toàn vẹn.",
          "Quan hệ một-nhiều thường lưu khóa ngoại ở phía nhiều. Quan hệ nhiều-nhiều thường cần bảng liên kết, mỗi hàng của bảng này nối một bản ghi ở bảng thứ nhất với một bản ghi ở bảng thứ hai."
        ]
      },
      {
        heading: "Chuẩn hóa dữ liệu",
        paragraphs: [
          "Chuẩn hóa giúp giảm dữ liệu lặp và tránh cập nhật không nhất quán. Nếu tên khóa học được sao chép vào từng dòng ghi danh, đổi tên khóa có thể đòi hỏi cập nhật nhiều nơi.",
          "Tách dữ liệu thành các bảng liên quan giúp một thông tin có một nơi quản lý chính. Tuy vậy, mô hình cần vẫn dễ hiểu; hãy bắt đầu từ các thực thể và quy tắc nghiệp vụ thực sự."
        ],
        bullets: [
          "Xác định thực thể và thuộc tính cần lưu.",
          "Chọn khóa ổn định để nhận diện bản ghi.",
          "Mô tả rõ quan hệ và tính bắt buộc giữa các bảng."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Phác thảo ba bảng học viên, khóa học và ghi danh. Xác định khóa chính, khóa ngoại và trường nào cần bắt buộc.",
          "Thử mô tả quan hệ bằng một ví dụ: một học viên có thể tham gia nhiều khóa, và một khóa có thể có nhiều học viên. Bảng ghi danh là nơi lưu từng cặp học viên-khóa."
        ]
      }
    ]
  },
  "sql-02": {
    introduction: "SELECT đọc dữ liệu từ bảng. Kết hợp WHERE, ORDER BY và LIMIT giúp thu hẹp, sắp xếp và giới hạn kết quả để trả lời câu hỏi cụ thể.",
    sections: [
      {
        heading: "Truy vấn SELECT",
        paragraphs: [
          "SELECT liệt kê các cột cần xem và FROM chỉ ra nguồn dữ liệu. Dấu sao chọn mọi cột, nhưng chọn cột cụ thể thường dễ đọc và tránh tải dữ liệu không cần thiết.",
          "Có thể đặt bí danh bằng AS để tên cột kết quả dễ hiểu hơn. DISTINCT loại các dòng trùng trong tập kết quả khi câu hỏi cần các giá trị duy nhất."
        ]
      },
      {
        heading: "Lọc bằng WHERE",
        paragraphs: [
          "WHERE lọc từng hàng theo điều kiện. Các toán tử so sánh thường dùng gồm bằng, khác, lớn hơn và nhỏ hơn; AND yêu cầu nhiều điều kiện cùng đúng, còn OR chỉ cần một điều kiện đúng.",
          "Dùng IS NULL hoặc IS NOT NULL để kiểm tra giá trị thiếu. So sánh với NULL bằng dấu bằng không cho kết quả như so sánh giá trị thông thường."
        ],
        bullets: [
          "LIKE kết hợp ký tự % để tìm chuỗi có mẫu.",
          "BETWEEN kiểm tra một khoảng bao gồm hai đầu mút.",
          "Đặt ngoặc khi trộn AND và OR để làm rõ thứ tự điều kiện."
        ]
      },
      {
        heading: "Sắp xếp và giới hạn",
        paragraphs: [
          "ORDER BY sắp xếp kết quả tăng dần hoặc giảm dần; có thể sắp xếp theo nhiều cột. Nếu không chỉ định thứ tự, dữ liệu không được đảm bảo xuất hiện theo một thứ tự cố định.",
          "LIMIT giới hạn số dòng trả về, hữu ích khi xem thử bảng lớn. Khi phân trang, nên dùng một thứ tự ổn định để hạn chế bản ghi dịch chuyển giữa các lần đọc."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Viết truy vấn chọn tên và cấp độ khóa học, lọc theo một cấp độ, sắp xếp theo tên rồi giới hạn số kết quả. Thay đổi điều kiện để kiểm tra các trường hợp không có kết quả.",
          "Mở rộng bằng truy vấn đếm kết quả phù hợp. Kiểm tra tên cột và kiểu dữ liệu trong schema trước khi viết truy vấn để tránh giả định sai."
        ]
      }
    ]
  },
  "sql-03": {
    introduction: "JOIN kết hợp các bảng dựa trên điều kiện liên hệ. Các hàm tổng hợp và GROUP BY giúp biến nhiều hàng dữ liệu thành kết quả tóm tắt.",
    sections: [
      {
        heading: "INNER JOIN",
        paragraphs: [
          "INNER JOIN chỉ trả về những cặp hàng thỏa điều kiện nối ở cả hai bảng. Điều kiện ON thường so sánh khóa ngoại với khóa chính, ví dụ enrollment.course_id bằng courses.id.",
          "Khi nhiều bảng có cột cùng tên, hãy dùng bí danh bảng và tiền tố để chỉ rõ cột thuộc bảng nào. Điều này làm truy vấn dễ đọc và tránh lỗi tên cột không rõ ràng."
        ]
      },
      {
        heading: "LEFT JOIN và dữ liệu thiếu",
        paragraphs: [
          "LEFT JOIN giữ tất cả hàng của bảng bên trái, kể cả khi không có hàng phù hợp ở bảng phải. Các cột phía phải khi không khớp nhận giá trị NULL.",
          "Điều kiện đặt trong WHERE có thể loại các hàng NULL và làm kết quả gần giống INNER JOIN. Hãy suy nghĩ điều kiện có ý nghĩa lọc hàng sau khi nối hay điều kiện xác định cặp hàng ở ON."
        ]
      },
      {
        heading: "GROUP BY và hàm tổng hợp",
        paragraphs: [
          "COUNT, SUM, AVG, MIN và MAX tính toán trên một nhóm dữ liệu. GROUP BY tạo nhóm theo một hoặc nhiều cột; mỗi nhóm cho ra một hàng tổng hợp.",
          "COUNT(*) đếm hàng, còn COUNT(column) bỏ qua giá trị NULL của cột đó. HAVING lọc nhóm sau tổng hợp, trong khi WHERE lọc hàng trước khi nhóm."
        ],
        bullets: [
          "Kiểm tra số dòng sau mỗi lần thêm JOIN để phát hiện nối làm nhân bản dữ liệu.",
          "Mỗi cột không tổng hợp trong SELECT cần phù hợp với quy tắc GROUP BY của cơ sở dữ liệu.",
          "Dùng bí danh để đặt tên dễ hiểu cho kết quả đếm."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Nối học viên, ghi danh và khóa học để liệt kê các khóa mỗi người đã tham gia. Sau đó nhóm theo học viên và đếm số khóa.",
          "Thử LEFT JOIN để bao gồm cả học viên chưa ghi danh. So sánh kết quả và giải thích vì sao một loại JOIN giữ được các dòng không có quan hệ."
        ]
      }
    ]
  },
  "sql-04": {
    introduction: "Một bảng tốt thể hiện rõ quy tắc dữ liệu và bảo vệ tính toàn vẹn. Bài học thiết kế cột, ràng buộc và chỉ mục phù hợp với cách ứng dụng sử dụng dữ liệu.",
    sections: [
      {
        heading: "Kiểu dữ liệu và ràng buộc",
        paragraphs: [
          "Chọn kiểu dữ liệu theo giá trị hợp lệ và thao tác cần thực hiện. Độ dài chuỗi nên đủ cho dữ liệu dự kiến; ngày giờ cần lưu dưới kiểu thời gian thay vì văn bản tự do.",
          "NOT NULL yêu cầu giá trị, UNIQUE ngăn trùng, CHECK giới hạn điều kiện và FOREIGN KEY bảo đảm quan hệ. Các ràng buộc đặt quy tắc ngay tại cơ sở dữ liệu, kể cả khi dữ liệu đến từ nhiều ứng dụng."
        ]
      },
      {
        heading: "Khóa và chỉ mục",
        paragraphs: [
          "Khóa chính có thể là một cột hoặc nhiều cột. Khóa ghép phù hợp khi một cặp giá trị chỉ được xuất hiện một lần, như một học viên chỉ ghi danh một lần vào cùng khóa.",
          "Chỉ mục giúp tìm hàng nhanh hơn nhưng chiếm dung lượng và làm thao tác ghi thêm công việc. Tạo chỉ mục cho cột thường xuyên dùng để tìm, nối hoặc sắp xếp; không cần lập chỉ mục mọi cột."
        ]
      },
      {
        heading: "Thay đổi schema an toàn",
        paragraphs: [
          "Khi thêm cột hoặc bảng vào hệ thống đang chạy, dùng migration có thể áp dụng lặp an toàn và kiểm tra trạng thái hiện tại. Không giả định script khởi tạo sẽ chạy lại trên volume cơ sở dữ liệu đã tồn tại.",
          "Trước thay đổi dữ liệu, tạo backup phù hợp và thử migration trên bản sao. Với dữ liệu đang được sử dụng, cân nhắc thứ tự triển khai để phiên bản ứng dụng cũ không bị lỗi khi schema thay đổi."
        ],
        bullets: [
          "Đặt tên constraint và index dễ nhận biết.",
          "Kiểm tra tác động của khóa ngoại khi xóa hoặc cập nhật bản ghi.",
          "Đo truy vấn thực tế trước khi tối ưu chỉ mục."
        ]
      },
      {
        heading: "Thực hành",
        paragraphs: [
          "Thiết kế bảng bài học gồm mã, khóa học, tiêu đề, thời lượng và vị trí. Thêm khóa chính, khóa ngoại, điều kiện thời lượng dương và ràng buộc thứ tự bài không trùng trong cùng khóa.",
          "Tạo một vài hàng mẫu rồi thử chèn dữ liệu sai như khóa học không tồn tại hoặc thời lượng âm. Xác nhận cơ sở dữ liệu từ chối các trường hợp vi phạm."
        ]
      }
    ]
  }
};
