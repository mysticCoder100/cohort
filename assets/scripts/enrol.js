try {
	let coursesRes = await fetch(
		`${location.origin}/assets/scripts/contents/courses.json`
	);
	let courses = await coursesRes.json();
	let names = courses.map((course) => course.name);
	$("#courses").append(
		names.map((name) => `<option value="${name}">${name}</option>`).join("")
	);
} catch (error) {}
var fee;
$("#email").on("input", function () {
	let email = $(this).val();
	let data = { email, exist: true };
	$.post("../../src/request.php", data, null, "json").done((res) => {
		if (res.status == "error") {
			$("#enrolSubmit").prop({ disabled: true });
			$(".email-error").empty().append(res.msg);
		} else {
			$(".email-error").empty();
			$("#enrolSubmit").prop({ disabled: false });
		}
	});
});
$("#phone").on("input", function () {
	let phone_number = $(this).val();
	let data = { phone_number, exist: true };
	$.post("../../src/request.php", data, null, "json").done((res) => {
		if (res.status == "error") {
			$("#enrolSubmit").prop({ disabled: true });
			$(".phone-error").empty().append(res.msg);
		} else {
			$(".phone-error").empty();
			$("#enrolSubmit").prop({ disabled: false });
		}
	});
});
$(".submit").click(function () {
	let data = new FormData($("#enrol")[0]);
	data.append("enrolValidate", true);
	$.ajax({
		method: "POST",
		url: "../../src/request.php",
		data: data,
		dataType: "json",
		processData: false,
		contentType: false,
		cache: false,
	}).done(function (res) {
		if (res.status == "error") {
			$("form div p").empty();
			$.each(res.message, function (i, el) {
				$(`.${i}`).append(el);
			});
			if (res.message.invalid) {
				$(".email-error").empty().append(res.message.invalid);
			} else if (res.message.num_invalid) {
				$(".phone-error").empty().append(res.message.num_invalid);
			}
		} else if (res.status == "success") {
			$("form div p").empty();
			$(".modal .firstname").text($("#firstname").val());
			$(".modal .lastname").text($("#lastname").val());
			$(".modal .othername").text($("#othername").val());
			$(".modal .email").text($("#email").val());
			$(".modal .phone").text($("#phone").val());
			$(".genderR").each(function () {
				if ($(this).prop("checked") == false) return;
				$(".modal .sex").text($(this).val());
			});
			$(".modal .dob").text($("#dob").val());
			$(".modal .admMode").text($("#admin_mode").val());
			$.get(
				"./assets/scripts/contents/courses.json",
				null,
				null,
				"json"
			).done((res) => {
				let name = $("#courses").val();
				let course = res.filter((el) => el.name == name)[0];
				$(".modal .description").empty().append(course.description);
				let hostel;
				if ($("#no").prop("checked") == true) {
					hostel = 0;
				} else {
					hostel = 40000;
				}
				$(".modal .course").empty().append(course.name);
				fee = course.tuition + hostel;
				$(".modal .price")
					.empty()
					.append(`₦ ${new Intl.NumberFormat().format(fee)}`);
			});
			$(".modal").addClass("show");
			$(".overlay").addClass("show");
		}
	});
});
$("#enrol").on("submit", function (e) {
	e.preventDefault();
	let data = new FormData($("#enrol")[0]);
	let button = $("#enrol_submit");
	let text = button.text();
	button.prop({disabled: true}).text("Please Wait")
	data.append("fee", fee);
	data.append("insert", true);
	// console.log(data);
	$.ajax({
		method: "POST",
		url: "../../src/request.php",
		data: data,
		dataType: "json",
		processData: false,
		contentType: false,
		cache: false,
		success: function (res) {
			if (res.status == "success") location.href = "../../login.php";
		},
	});
});

$(".overlay").click(function () {
	$(".modal").removeClass("show");
	$(".overlay").removeClass("show");
});
$("#close").click(function () {
	$(".modal").removeClass("show");
	$(".overlay").removeClass("show");
});
