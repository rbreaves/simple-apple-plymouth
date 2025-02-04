//---------------------------------[ Simple Apple Plymouth by Supdrewin ]-------------------------------------//

Window.SetBackgroundTopColor(0, 0, 0);
Window.SetBackgroundBottomColor(0, 0, 0);

function scale(dot) {
	dot *= Window.GetHeight();
	return dot;
}

logo.original_image = Image("logo.png");
logo.image = logo.original_image.Scale(scale(0.14), scale(0.14));
logo.sprite = Sprite(logo.image);

logo.sprite.SetOpacity(1);
logo.sprite.SetX((Window.GetX() + Window.GetWidth() - logo.image.GetWidth()) / 2);
logo.sprite.SetY((Window.GetY() + Window.GetHeight() - logo.image.GetHeight()) * 0.45);

//--------------------------------------------- Dialogue ----------------------------------------------------//

status = "normal";

function dialog_setup() {
	local.box;
	local.lock;
	local.entry;

	box.image = Image("box.png");
	lock.image = Image("lock.png");
	entry.image = Image("entry.png");

	box.sprite = Sprite(box.image);
	box.x = Window.GetX() + Window.GetWidth() / 2 - box.image.GetWidth() / 2;
	box.y = (Window.GetY() + Window.GetHeight() / 2 - box.image.GetHeight() / 2) + logo.image.GetHeight();
	box.z = 10000;
	box.sprite.SetPosition(box.x, box.y, box.z);

	lock.sprite = Sprite(lock.image);
	lock.x = box.x + box.image.GetWidth() / 2 - (lock.image.GetWidth() + entry.image.GetWidth()) / 2;
	lock.y = box.y + box.image.GetHeight() / 2 - lock.image.GetHeight() / 2;
	lock.z = box.z + 1;
	lock.sprite.SetPosition(lock.x, lock.y, lock.z);

	entry.sprite = Sprite(entry.image);
	entry.x = lock.x + lock.image.GetWidth();
	entry.y = box.y + box.image.GetHeight() / 2 - entry.image.GetHeight() / 2;
	entry.z = box.z + 1;
	entry.sprite.SetPosition(entry.x, entry.y, entry.z);

	global.dialog.box = box;
	global.dialog.lock = lock;
	global.dialog.entry = entry;
	global.dialog.bullet_image = Image("bullet.png");
	dialog_opacity(1);
}

function dialog_opacity(opacity) {
	dialog.box.sprite.SetOpacity(opacity);
	dialog.lock.sprite.SetOpacity(opacity);
	dialog.entry.sprite.SetOpacity(opacity);

	for (index = 0; dialog.bullet[index]; index++) {
		dialog.bullet[index].sprite.SetOpacity(opacity);
	}
}

function display_normal_callback() {
	global.status = "normal";

	if (global.dialog)
		dialog_opacity(0);
}

function display_password_callback(prompt, bullets) {
	global.status = "password";

	if (!global.dialog)
		dialog_setup();
	else
		dialog_opacity(1);

	for (index = 0; dialog.bullet[index] || index < bullets; index++) {
		if (!dialog.bullet[index]) {
			dialog.bullet[index].sprite = Sprite(dialog.bullet_image);
			dialog.bullet[index].x = dialog.entry.x + index * dialog.bullet_image.GetWidth();
			dialog.bullet[index].y = dialog.entry.y + dialog.entry.image.GetHeight() / 2 - dialog.bullet_image.GetHeight() / 2;
			dialog.bullet[index].z = dialog.entry.z + 1;
			dialog.bullet[index].sprite.SetPosition(dialog.bullet[index].x, dialog.bullet[index].y, dialog.bullet[index].z);
		}

		if (index < bullets)
			dialog.bullet[index].sprite.SetOpacity(1);
		else
			dialog.bullet[index].sprite.SetOpacity(0);
	}
}

Plymouth.SetDisplayNormalFunction(display_normal_callback);
Plymouth.SetDisplayPasswordFunction(display_password_callback);

//-------------------------------------------- Progress Bar --------------------------------------------------//

if (Plymouth.GetMode() == "boot") {
	progress_box.original_image = Image("progress/progress_box.png");
	progress_box.image = progress_box.original_image.Scale(scale(0.24), scale(0.01));
	progress_box.sprite = Sprite(progress_box.image);

	progress_box.x = Window.GetX() + Window.GetWidth() / 2 - progress_box.image.GetWidth() / 2;
	progress_box.y = Window.GetY() + Window.GetHeight() * 0.65 - progress_box.image.GetHeight() / 2;
	progress_box.sprite.SetPosition(progress_box.x, progress_box.y, 0);

	progress_bar.original_image = Image("progress/progress_bar.png");
	progress_bar.image = progress_bar.original_image.Scale(scale(0.24), scale(0.01));
	progress_bar.sprite = Sprite();

	progress_bar.x = Window.GetX() + Window.GetWidth() / 2 - progress_bar.image.GetWidth() / 2;
	progress_bar.y = Window.GetY() + Window.GetHeight() * 0.65 - progress_box.image.GetHeight() / 2;
	progress_bar.sprite.SetPosition(progress_bar.x, progress_bar.y, 1);

	function progress_callback(duration, progress) {
		if (progress_bar.next_image.GetWidth() != Math.Int(progress_bar.image.GetWidth() * progress)) {
			progress_bar.next_image = progress_bar.image.Scale(progress_bar.image.GetWidth(progress_bar.image) * progress, progress_bar.image.GetHeight());
			progress_bar.sprite.SetImage(progress_bar.next_image);
		}
	}
} else {
	spin.original_image = Image("spin/spin0.png");
	spin.image = spin.original_image.Scale(scale(0.03), scale(0.03));

	spin.sprite = Sprite();
	spin.sprite.SetX((Window.GetX() + Window.GetWidth() - spin.image.GetWidth()) / 2);
	spin.sprite.SetY((Window.GetY() + Window.GetHeight() - spin.image.GetHeight()) * 0.65);

	function progress_callback(time) {
		spin.original_image = Image("spin/spin" + Math.Int((time * 6) % 12) + ".png");
		spin.image = spin.original_image.Scale(scale(0.03), scale(0.03));
		spin.sprite.SetImage(spin.image);
	}
}

Plymouth.SetBootProgressFunction(progress_callback);

//----------------------------------------------- Quit ---------------------------------------------------//

function quit_callback() {
	logo.sprite.SetOpacity(1);
}

Plymouth.SetQuitFunction(quit_callback);

//---------------------------------------------- Message -------------------------------------------------//

message_sprites = [];
message_sprite_count = 0;
message_sprite_y = 10;

function display_message_callback(text) {
	my_image = Image.Text(text, 1, 1, 1);

	message_sprites[message_sprite_count] = Sprite(my_image);
	message_sprites[message_sprite_count].SetPosition(10, message_sprite_y, 10000);
	message_sprites[message_sprite_count].text = text;
	message_sprite_count++;
	message_sprite_y += my_image.GetHeight();
}

function hide_message_callback(text) {
	for (i = 0; i < message_sprite_count; i++) {
		if (message_sprites[i].text == text)
			message_sprites[i] = NULL;
	}
}

Plymouth.SetDisplayMessageFunction(display_message_callback);
Plymouth.SetHideMessageFunction(hide_message_callback);
