// ==UserScript==
// @name Kinozal.tv/me/guru 2020 | Кнопки скачивания внутри раздачи.
// @description Magnet - Скачать без учёта рейтинга/скачивания / AceStream - Смотреть через AceStream ( Актуально для Android TV/Планшета/Телефона ) / (НОВОЕ!) Появились Настройки, можете убрать ненужное (кнопки,подтверждение).
// @namespace none
// @version 0.5.5
// @homepageURL  https://github.com/vovka1992/kinozal-knopki-v-nutri
// @downloadURL  https://github.com/vovka1992/kinozal-knopki-v-nutri/raw/master/kinozal-script.user.js
// @author https://greasyfork.org/ru/users/173690
// @author https://greasyfork.org/scripts/40843
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAD1BMVEU7R4CAAAD4+/z9787///8A0Su5AAAASUlEQVR4AXWPAQrEMBACzen/33wdkGILFZQdSFxWkZKoyWBsd5JXvFgMfC6ZLBs0pq8Mtq8f0Bcbw9N3HvuI8i14sAt/e8/73j/4FwHuDyR5AQAAAABJRU5ErkJggg==
// @include /(https?:\/\/)?(www\.)?kinozal\.(me|tv|guru|website)\/(details|comment)\.php.*/
// @require https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.min.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_getResourceText
/* globals $ */
// ==/UserScript==
(function() {
	'use strict';
	GM_addStyle(`
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.min.css";
BUTTON.btndt{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;
-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#dc3545;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndt:hover{color:#fff;background-color:#c82333;box-shadow:0 0 0 1px #71000b}
BUTTON.btndt:focus,BUTTON.btndt:active,BUTTON.btndt:visited{color:#fff;background-color:#b31120;box-shadow:0 0 0 1px #71000b}
BUTTON.btndm{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;
-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#3f8dfa;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndm:hover{color:#fff;background-color:#237bc8;box-shadow:0 0 0 1px #003c71}
BUTTON.btndm:focus,BUTTON.btndm:active,BUTTON.btndm:visited{color:#fff;background-color:#1167b3;box-shadow:0 0 0 1px #003c71}
BUTTON.btnca{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;
-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#62dc35;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btnca:hover{color:#fff;background-color:#4fc823;box-shadow:0 0 0 1px #1e7100}
BUTTON.btnca:focus,BUTTON.btnca:active,BUTTON.btnca:visited{color:#fff;background-color:#3cb311;box-shadow:0 0 0 2px #1e7100}
@font-face{font-family:"Open Sans";font-style:normal;font-weight:400;src:local("Open Sans"),local(OpenSans),url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}
#knzl_settings {padding:5px;font-family:tahoma,arial,verdana,sans-serif,Lucida Sans;position:fixed;left:0;top:0;background-color:#fff;border:1px solid #000;border-radius:4px 4px 4px 4px;
-moz-border-radius:4px;-webkit-border-radius:4px 4px 4px 4px;-webkit-box-shadow:0 0 0 1px #000;-moz-box-shadow:0 0 0 1px #000;box-shadow:0 0 0 1px #000}
#knzl_settings .header{font-size:16px;padding:5px;color:#f00;font-weight:bold;text-align:center;}
#knzl_settings .title{text-transform:uppercase;font-size:14px;color:#000;font-weight:bold;text-align:center}
#knzl_settings .fields{font-size:14px;text-transform:uppercase;}
#knzl_settings .fields .row{clear:both;padding: 5px 0px;}
#knzl_settings .fields .row .col1{width:230px;float:left;padding:0 20px}
#knzl_settings .fields .row .col2{width:60px;float:left}
#knzl_settings .knzl-color{max-width:70px;max-height:20px}
#knzl_settings input[type=checkbox]::after{font-size:14px;position:relative;left:17px;content:"НЕТ";top:-3px}
#knzl_settings input[type=checkbox]:checked::after{font-size:14px;content:"ДА";top:-3px}
`);

	function copy(str) {
		var tmp = document.createElement('textarea'),
			focus = document.activeElement;
		tmp.value = str;
		document.body.appendChild(tmp);
		tmp.select();
		document.execCommand('copy');
		document.body.removeChild(tmp);
		focus.focus();
	}

	function declOfNum(n, text_forms) {
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20) {
			return text_forms[2];
		}
		if (n1 > 1 && n1 < 5) {
			return text_forms[1];
		}
		if (n1 == 1) {
			return text_forms[0];
		}
		return text_forms[2];
	}
	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-start',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

	function KinozalDetailSettingsScript() {
		this.settings = {};

		this.loadSettings = function() {
			this.settings = {
				ShowTorrentButton: GM_getValue('ShowTorrentButton', true),
				ShowMagnetButton: GM_getValue('ShowMagnetButton', true),
				ShowAcestreamButton: GM_getValue('ShowAcestreamButton', true),
				ConfirmDownloadTorrent: GM_getValue('ConfirmDownloadTorrent', true),
				ConfirmDownloadMagnet: GM_getValue('ConfirmDownloadMagnet', true),
				ShowHelpButton: GM_getValue('ShowHelpButton', true)
			};
		}

		this.toggleSettings = function() {
			var $sett_wnd = $('#knzl_settings'),
				x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
				y = parseInt(($(window).height() - $sett_wnd.height()) / 2);

			if (this.settings.ShowTorrentButton) {
				$('#ShowTorrentButton').attr('checked', true);
			}
			if (this.settings.ShowMagnetButton) {
				$('#ShowMagnetButton').attr('checked', true);
			}
			if (this.settings.ShowAcestreamButton) {
				$('#ShowAcestreamButton').attr('checked', true);
			}
			if (this.settings.ConfirmDownloadTorrent) {
				$('#ConfirmDownloadTorrent').attr('checked', true);
			}
			if (this.settings.ConfirmDownloadMagnet) {
				$('#ConfirmDownloadMagnet').attr('checked', true);
			}
			if (this.settings.ShowHelpButton) {
				$('#ShowHelpButton').attr('checked', true);
			}
			$('#knzl_settings').css({'left': x,'top': y}).toggle('fast');
		}

		this.addSettings = function() {
			var $tab = $('<li style="padding-left:14px;"><span class="bulet"></span><a href="javascript:;" title="Настройка скрипта">Настройка скрипта</a></li>');
			var obj = this;
			$tab.click(function() {
				obj.toggleSettings();
			});
			$('ul.men:first').append($tab);

			var $wnd = $(`
<div id="knzl_settings" style="display: none">
	<div class="header">Настройка скрипта<br>
	<h3>Кнопки скачивания внутри раздачи</h3></div>
	<div class="fields">
		<div class="row">
			<div class="title">Торрент настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowTorrentButton"></div>
		</div>
		<div class="row">
			<div class="col1">Включить подтверждение?</div>
			<div class="col2"><input type="checkbox" id="ConfirmDownloadTorrent"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Магнит настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowMagnetButton"></div>
		</div>
		<div class="row">
			<div class="col1">Включить подтверждение?</div>
			<div class="col2"><input type="checkbox" id="ConfirmDownloadMagnet"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Acestream настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowAcestreamButton"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Остальное</div>
			<div class="col1">Показать кнопку "Помощь" ?</div>
			<div class="col2"><input type="checkbox" id="ShowHelpButton"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="swal2-confirm swal2-styled" value="Сохранить настройки" id="knzl_save_settings" />
		</div>
	</div>
</div>`);
			$('body').append($wnd);
			$('#knzl_save_settings').live('click', function() {
				GM_setValue('ShowTorrentButton', $('#ShowTorrentButton').is(':checked'));
				GM_setValue('ConfirmDownloadTorrent', $('#ConfirmDownloadTorrent').is(':checked'));
				GM_setValue('ShowMagnetButton', $('#ShowMagnetButton').is(':checked'));
				GM_setValue('ConfirmDownloadMagnet', $('#ConfirmDownloadMagnet').is(':checked'));
				GM_setValue('ShowAcestreamButton', $('#ShowAcestreamButton').is(':checked'));
				GM_setValue('ShowHelpButton', $('#ShowHelpButton').is(':checked'));

				obj.loadSettings();
				$('#knzl_settings').toggle('fast');
				location.reload();
			});
		}
		this.Kinozal_MainScript = function() {
			var obj = this;
			var set_buttons = document.querySelector("table.w100p");
			var id = new RegExp('id=(\\d+)').exec(window.location.href)[1];
			var film_name = $('H1 a').text().split(" / ");
			var signup = "Чтобы скачать, нужно зайти на сайт!";
			var txt_dl_torrent_info = '<b><font color="#cc0000">Cкачать торрент-файл:</font></b><br>Для того, чтобы скачать эту раздачу - скачайте торрент-файл и запустите его при помощи клиента.';
			var txt_dl_magnet_info = '<b><font color="#0000cc">Cкачать через Magnet:</font></b><br>Скачивайте сколько угодно, ваш рейтинг не изменится, так как данный метод не затрагивает ваш профиль!';
			var txt_cp_acestream_info = '<b><font color="#00cc00">Смотреть через ACESTREAM:</font></b><br>Смотрите через Acestream ( На Android TV, в Планшете, в Телефоне )';
			set_buttons.classList.add('bx1');
			set_buttons.innerHTML = '<tbody id="copy_form">\
	' + (obj.settings.ShowTorrentButton ? '<tr><td style="width: 400px;" class="nw"><button id="Torrent" type="button" class="btndt">Cкачать торрент-файл</button></td><td>' + txt_dl_torrent_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '') + '\
	' + (obj.settings.ShowMagnetButton ? '<tr><td style="width: 400px;" class="nw"><button id="Magnet" type="button" class="btndm">Cкачать через Magnet</button></td><td>' + txt_dl_magnet_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '') + '\
	' + (obj.settings.ShowAcestreamButton ? '<tr><td style="width: 400px;" class="nw"><button id="acestream" type="button" class="btnca">ACESTREAM</button></td><td>' + txt_cp_acestream_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '') + '\
	' + (obj.settings.ShowHelpButton ? '<tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : '') + '\
</tbody>';
			document.getElementById('copy_form').addEventListener('click', async function(evt) {
				var target = evt.target;
				if (target.id === 'help') {
					Swal.fire({
						html: `<b style="color:red;font-size:16px;">Ленитесь нажимать каждый раз мышкой на кнопки скачивания? Воспользуйся клавиатурой!</b><br>
<div style="text-align:left;font-size:14px;"><b>SHIFT + 1</b>&nbsp;&nbsp;&nbsp;&nbsp;Скачать Торрент файл<br>
<b>SHIFT + 2</b>&nbsp;&nbsp;&nbsp;&nbsp;Скачать через Магнет<br>
<b>SHIFT + 3</b>&nbsp;&nbsp;&nbsp;&nbsp;Скопировать Фильм, Серию, Этап</div><br><br>
<b style="color:red;font-size:16px;">Скопировал через ACESTREAM, что дальше?</b><br>
<div style="text-align:left;font-size:14px;"><b>1.</b> Создай <b><i>.m3u</i></b> файл<br>
<b>2.</b> Вставь скопированный текст и Сохрани файл<br>
<b>3.</b> Открой этот плейлист через (PotPlayer, VLC) и наслаждайся просмотром видео</div><br><br>
<b style="color:red;font-size:16px;">Не показывает видео через ACESTREAM, почему?</b><br>
<div style="text-align:left;font-size:14px;">Возможно вы выбрали раздачу (Например: Фильм <b>Blue-Ray</b> с субтитрами и отдельными звуковыми дорожками, и прочими файлами),
открыв вкладку "<b>Список файлов: 9</b>", там увидите весь список файлов.<br><br>
Что бы посмотреть этот Фильм (ну или сериал, с той же проблемой) нужно выяснить под каким номером является этот файл.<br><br>
После этого как узнали что сам файл является под номером 5 ( Т.е. Сам файл <b>00000.m2ts</b> ),<br><br>
в вашем плейлисте меняете циферку вместо <b>...&playlist_output_format_vod=hls&_idx=<b style="color:red;">0</b>&.mp4</b> на <b style="color:red;">4</b>.<br><br>
Почему 4? Так как во всех раздачах, все файлы начинаются с цифры 0, а это есть первый файл. 0 = 1, 1 = 2, 2 = 3 и т.д.<br>
<br>Вот <a href="https://greasyfork.org/system/screenshots/screenshots/000/023/622/original/acestream_help.jpg?1601067663" target="_blank">картинки ссылка</a> для полной информации с подробным разъяснением.</div>`,
						showCloseButton: true,
						showCancelButton: false,
						confirmButtonText: 'Понял <i class="fa fa-thumbs-up"></i>',
						confirmButtonColor: '#3085d6'
					})
				} else if (target.id === 'acestream') {
					if (film_name[0].match(/серии|сезон|(выпуск)|этапы|(логия)/g)) {
						if (film_name[0].match(/(логия)/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
							var selbtn2 = "ОДИН ФИЛЬМ";
						} else if (film_name[0].match(/(выпуск)/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
							var selbtn2 = "ОДИН ВЫПУСК";
						} else if (film_name[0].match(/серии|сезон/gi)) {
							var selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
							var selbtn2 = "ОДНА СЕРИЯ";
						} else if (film_name[0].match(/этапы/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
							var selbtn2 = "ОДИН ЭТАП";
						}
						Swal.fire({
							title: '' + film_name[0].toUpperCase() + '',
							html: `Копировать для просмотра через AceStream<br>
<button type="button" id="1" class="swal2-confirm swal2-styled">${selbtn1}</button>
<button type="button" id="2" class="swal2-confirm swal2-styled">${selbtn2}</button><br>
<button type="button" id="cancel" class="swal2-deny swal2-styled">ОТМЕНА</button>`,
							showCancelButton: false,
							showConfirmButton: false
						})
						$("#1").on("click", async function(e) {
							const {
								value: formValues
							} = await Swal.fire({
								title: film_name[0].toUpperCase(),
								html: 'Введите количество серий, фильмов, выпусков, этапов',
								input: 'text',
								inputPlaceholder: 'Кол-во',
								inputAttributes: {
									min: 1,
									max: 400,
									maxlength: 3
								},
								showCancelButton: true,
								inputValidator: (value) => {
									return new Promise((resolve) => {
										if (!value) {
											resolve('Введите цифру!')
										} else if (isNaN(value)) {
											resolve('Ввести можно только цифры!')
										} else if (value < 1 || value > 400) {
											resolve('Ввести можно только с 1 до 400!')
										} else {
											resolve()
										}
									})
								},
								showCloseButton: false,
								showCancelButton: false,
								showConfirmButton: true,
								confirmButtonColor: '#3085d6',
								confirmButtonText: 'Копировать'
							})
							if (formValues) {
								var year1 = film_name[1].replace(/(.*)/gi, "$1");
								var year2 = film_name[2].replace(/(.*)/gi, "$1");
								var get_year = new RegExp('^[0-9]+$').exec(film_name[2]);
								if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
									var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
								} else {
									var search_film_name = film_name[0].toUpperCase();
								}
								var filmname = (get_year) ? search_film_name + " / " + year2 : search_film_name + " / " + year1;
								$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") == 105) {
										Toast.fire({
											icon: 'warning',
											html: signup
										})
									} else {
										if (film_name[0].match(/(логия)/gi)) {
											var number_copy = formValues + " " + declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
										} else if (film_name[0].match(/(выпуск)/gi)) {
											var number_copy = formValues + " " + declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
										} else if (film_name[0].match(/серии|сезон/gi)) {
											var number_copy = formValues + " " + declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
										} else if (film_name[0].match(/этапы/gi)) {
											var number_copy = formValues + " " + declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
										}
										var hash_result = new RegExp('Инфо хеш: (.\{40\})').exec(s)[1];
										var copy_text = "#EXTM3U";
										var i = 0;
										while (i < formValues) {
											var set_i = 1 + i;
											if (film_name[0].match(/(логия)/gi)) {
												var copyname = filmname + " / " + set_i + "-й ФИЛЬМ";
											} else if (film_name[0].match(/(выпуск)/gi)) {
												var copyname = filmname + " / " + set_i + " ВЫПУСК";
											} else if (film_name[0].match(/серии|сезон/gi)) {
												var copyname = filmname + " / " + set_i + " СЕРИЯ";
											} else if (film_name[0].match(/этапы/gi)) {
												var copyname = filmname + " / " + set_i + " ЭТАП";
											}
											copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
											i++;
										}
										copy(copy_text);
										Toast.fire({
											icon: 'success',
											title: 'СКОПИРОВАНО ' + number_copy + ' !'
										})
									}
								});
							}
						});
						$("#2").on("click", async function(e) {
							const {
								value: formValues
							} = await Swal.fire({
								title: film_name[0].toUpperCase(),
								html: 'Введите серию / фильм / выпуск / этап',
								input: 'text',
								inputPlaceholder: 'Цифра',
								inputAttributes: {
									min: 1,
									maxlength: 5
								},
								showCancelButton: true,
								inputValidator: (value) => {
									return new Promise((resolve) => {
										if (!value) {
											resolve('Введите цифру!')
										} else if (isNaN(value)) {
											resolve('Только цифры!')
										} else {
											resolve()
										}
									})
								},
								showCloseButton: false,
								showCancelButton: false,
								showConfirmButton: true,
								confirmButtonColor: '#3085d6',
								confirmButtonText: 'Копировать'
							})
							if (formValues) {
								var year1 = film_name[1].replace(/(.*)/gi, "$1");
								var year2 = film_name[2].replace(/(.*)/gi, "$1");
								var get_year = new RegExp('^[0-9]+$').exec(film_name[2]);
								if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
									var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
								} else {
									var search_film_name = film_name[0].toUpperCase();
								}
								var filmname = (get_year) ? search_film_name + " / " + year2 : search_film_name + " / " + year1;
								$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") == 105) {
										Toast.fire({
											icon: 'warning',
											html: signup
										})
									} else {
										var hash_result = new RegExp('Инфо хеш: (.\{40\})').exec(s)[1];
										var set_i = formValues - 1;
										if (film_name[0].match(/(логия)/gi)) {
											var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
										} else if (film_name[0].match(/(выпуск)/gi)) {
											var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
										} else if (film_name[0].match(/серии|сезон/gi)) {
											var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
										} else if (film_name[0].match(/этапы/gi)) {
											var number_copy = formValues + " ЭТАП СКОПИРОВАН !";
										}
										if (film_name[0].match(/(логия)/gi)) {
											var copyname = filmname + " / " + formValues + "-й ФИЛЬМ";
										} else if (film_name[0].match(/(выпуск)/gi)) {
											var copyname = filmname + " / " + formValues + " ВЫПУСК";
										} else if (film_name[0].match(/серии|сезон/gi)) {
											var copyname = filmname + " / " + formValues + " СЕРИЯ";
										} else if (film_name[0].match(/этапы/gi)) {
											var copyname = filmname + " / " + formValues + " ЭТАП";
										}
										copy("#EXTM3U\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
										Toast.fire({
											icon: 'success',
											title: number_copy
										})
									}
								});
							}
						});
						$("#cancel").on("click", function(e) {
							Swal.close();
						});
					} else {
						var year1 = film_name[1].replace(/(.*)/gi, "$1");
						var year2 = film_name[2].replace(/(.*)/gi, "$1");
						var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
						var filmname = (get_year) ? film_name[0].toUpperCase() + " / " + year1 : film_name[0].toUpperCase() + " / " + year2;
						$.get("/get_srv_details.php?id=" + id + "&action=2", function(s) {
							if (s.toString().indexOf("signup.php") == 105) {
								Toast.fire({
									icon: 'warning',
									html: signup
								})
							} else {
								Toast.fire({
									icon: 'success',
									title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скопирована!'
								})
								var hash_result = new RegExp('Инфо хеш: (.\{40\})').exec(s)[1];
								copy("#EXTM3U\r\n#EXTINF:-1," + filmname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result + "&playlist_output_format_vod=hls&_idx=0&.mp4");
							}
						})
					}
				} else if (target.id === 'Magnet') {
					if (obj.settings.ConfirmDownloadMagnet) {
						Swal.fire({
							title: "Скачать через Magnet?",
							html: "Ваш рейтинг не упадёт, можете скачивать бесконечно!",
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Да',
							cancelButtonText: 'Нет'
						}).then(function(result) {
							if (result.value) {
								$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") == 105) {
										Toast.fire({
											icon: 'warning',
											html: signup
										})
									} else {
										window.location.href = "magnet:?xt=urn:btih:" + new RegExp('Инфо хеш: (.\{40\})').exec(s)[1];
										Toast.fire({
											icon: 'success',
											title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Magnet!'
										})
									}
								});
							}
						})
					} else {
						$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") == 105) {
								Toast.fire({
									icon: 'warning',
									html: signup
								})
							} else {
								window.location.href = "magnet:?xt=urn:btih:" + new RegExp('Инфо хеш: (.\{40\})').exec(s)[1];
								Toast.fire({
									icon: 'success',
									title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Magnet!'
								})
							}
						});
					}
				} else if (target.id === 'Torrent') {
					if (obj.settings.ConfirmDownloadTorrent) {
						Swal.fire({
							title: "Скачать Торрент файл?",
							html: "Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!",
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Да',
							cancelButtonText: 'Нет'
						}).then(function(result) {
							if (result.value) {
								$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") == 105) {
										Toast.fire({
											icon: 'warning',
											html: signup
										})
									} else {
										window.location.href = "/download.php?id=" + id;
										Toast.fire({
											icon: 'success',
											title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Торрент!'
										})
									}
								});
							}
						})
					} else {
						$.get('/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") == 105) {
								Toast.fire({
									icon: 'warning',
									html: signup
								})
							} else {
								window.location.href = "/download.php?id=" + id;
								Toast.fire({
									icon: 'success',
									title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Торрент!'
								})
							}
						});
					}
				}
			}, false);
		}

		this.init = function() {
			this.loadSettings();
			this.addSettings();
			this.Kinozal_MainScript();
		}
	}

	document.addEventListener('keydown', function(event) {
		if (event.code == 'Digit1' && (event.shiftKey || event.metaKey)) {
			document.getElementById("Torrent").click();
		} else if (event.code == 'Digit2' && (event.shiftKey || event.metaKey)) {
			document.getElementById("Magnet").click();
		} else if (event.code == 'Digit3' && (event.shiftKey || event.metaKey)) {
			if (document.getElementById('acestream') != null) {
				document.getElementById("acestream").click();
			}
		}
	});
	(new KinozalDetailSettingsScript()).init();
})();