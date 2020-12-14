/*
Kinozal.tv/me/guru 2020 | Кнопки скачивания внутри раздачи.
Версия скрипта 1.0.0
*/
GM_addStyle(`
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.min.css";
BUTTON.btndt{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#dc3545;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndt:hover{color:#fff;background-color:#c82333;box-shadow:0 0 0 1px #71000b}
BUTTON.btndt:focus,BUTTON.btndt:active,BUTTON.btndt:visited{color:#fff;background-color:#b31120;box-shadow:0 0 0 1px #71000b}
BUTTON.btndm{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#3f8dfa;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndm:hover{color:#fff;background-color:#237bc8;box-shadow:0 0 0 1px #003c71}
BUTTON.btndm:focus,BUTTON.btndm:active,BUTTON.btndm:visited{color:#fff;background-color:#1167b3;box-shadow:0 0 0 1px #003c71}
BUTTON.btnimg{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#3f8dfa;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btnimg:hover{color:#fff;background-color:#237bc8;box-shadow:0 0 0 1px #003c71}
BUTTON.btnimg:focus,BUTTON.btndm:active,BUTTON.btndm:visited{color:#fff;background-color:#1167b3;box-shadow:0 0 0 1px #003c71}
BUTTON.btnca{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#7dfa3f;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btnca:hover{color:#fff;background-color:#64c722;box-shadow:0 0 0 1px #397100}
BUTTON.btnca:focus,BUTTON.btnca:active,BUTTON.btnca:visited{color:#fff;background-color:#5ab311;box-shadow:0 0 0 1px #397100}
@font-face{font-family:"Open Sans";font-style:normal;font-weight:400;src:local("Open Sans"),local(OpenSans),url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}
#acemgn_script_settings{padding:5px;font-family:tahoma,arial,verdana,sans-serif,Lucida Sans;position:fixed;left:0;top:0;background-color:#fff;border:1px solid #000;border-radius:4px 4px 4px 4px;-moz-border-radius:4px;-webkit-border-radius:4px 4px 4px 4px;-webkit-box-shadow:0 0 0 1px #000;-moz-box-shadow:0 0 0 1px #000;box-shadow:0 0 0 1px #000}
#acemgn_script_settings .header{font-size:16px;padding:5px;color:red;font-weight:700;text-align:center}
#acemgn_script_settings .title{text-transform:uppercase;font-size:14px;color:#000;font-weight:700;text-align:center}
#acemgn_script_settings .fields{font-size:14px;text-transform:uppercase}
#acemgn_script_settings .fields .row{clear:both;padding:5px 0}
#acemgn_script_settings .fields .row .col1{width:250px;float:left;padding:0 20px}
#acemgn_script_settings .fields .row .col2{width:130px;float:left}
#acemgn_script_settings .knzl-color{max-width:70px;max-height:20px}
#acemgn_script_settings input[type=text]{width:85%}
#acemgn_script_settings input[type=checkbox]::after{font-size:14px;position:relative;left:17px;content:"НЕТ";top:-3px}
#acemgn_script_settings input[type=checkbox]:checked::after{font-size:14px;content:"ДА";top:-3px}
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
var get_url = location.href;
var reg_kinozal_search = new RegExp('kinozal.(me|tv|guru|website)\/(browse|persons).php', 'i');
var mirror_kinozal_search = new RegExp('appspot.com\/(browse|persons).php', 'i');
var reg_kinozal_detailed = new RegExp('kinozal.(me|tv|guru|website)\/(details|comment).php', 'i');
var mirror_kinozal_detailed = new RegExp('appspot.com\/(details|comment).php', 'i');
var reg_rutor = new RegExp('rutor.(info|is)/torrent/*', 'i');
if (reg_kinozal_search.test(get_url) || mirror_kinozal_search.test(get_url)) {
	function KinozalSearchSettingsScript() {
		this.settings = {};
		this.loadSettings = function() {
			if (GM_getValue("ShowImagesButton") == undefined) {
				GM_setValue("ShowImagesButton", true);
			}
			if (GM_getValue("ShowTorrentButton") == undefined) {
				GM_setValue("ShowTorrentButton", true);
			}
			if (GM_getValue("ShowMagnetButton") == undefined) {
				GM_setValue("ShowMagnetButton", true);
			}
			if (GM_getValue("ShowAcestreamButton") == undefined) {
				GM_setValue("ShowAcestreamButton", true);
			}
			if (GM_getValue("ConfirmDownloadTorrent") == undefined) {
				GM_setValue("ConfirmDownloadTorrent", true);
			}
			if (GM_getValue("ConfirmDownloadMagnet") == undefined) {
				GM_setValue("ConfirmDownloadMagnet", true);
			}
			if (GM_getValue("ChangeIconsToText") == undefined) {
				GM_setValue("ChangeIconsToText", false);
			}
			if (GM_getValue("ShowMarkTorrents") == undefined) {
				GM_setValue("ShowMarkTorrents", false);
			}
			if (GM_getValue("MarkValue") == undefined) {
				GM_setValue("MarkValue", '4K 2160P');
			}
			this.settings = {
				ShowImagesButton: GM_getValue('ShowImagesButton', true),
				ShowTorrentButton: GM_getValue('ShowTorrentButton', true),
				ShowMagnetButton: GM_getValue('ShowMagnetButton', true),
				ShowAcestreamButton: GM_getValue('ShowAcestreamButton', true),
				ConfirmDownloadTorrent: GM_getValue('ConfirmDownloadTorrent', true),
				ConfirmDownloadMagnet: GM_getValue('ConfirmDownloadMagnet', true),
				ChangeIconsToText: GM_getValue('ChangeIconsToText', false),
				ShowMarkTorrents: GM_getValue('ShowMarkTorrents', false),
				MarkValue: GM_getValue('MarkValue', '4K 2160P')
			};
		}
		this.toggleSettings = function() {
			var $sett_wnd = $('#acemgn_script_settings'),
				x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
				y = parseInt(($(window).height() - $sett_wnd.height()) / 2);
			if (this.settings.ShowImagesButton) {
				$('#ShowImagesButton').attr('checked', true);
			}
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
			if (this.settings.ChangeIconsToText) {
				$('#ChangeIconsToText').attr('checked', true);
			}
			if (this.settings.ShowMarkTorrents) {
				$('#ShowMarkTorrents').attr('checked', true);
			}
			$('#MarkValue').val(this.settings.MarkValue);
			$('#acemgn_script_settings').css({
				'left': x,
				'top': y
			}).toggle('fast');
		}
		this.addSettings = function() {
			var $tab = $('<li style="padding-left:14px;"><span class="bulet"></span><a href="javascript:;" title="Настройка скрипта">Настройка скрипта</a></li>');
			var obj = this;
			$tab.click(function() {
				obj.toggleSettings();
			});
			$('ul.men:first').append($tab);
			var $wnd = $(`
<div id="acemgn_script_settings" style="display: none">
	<div class="header">Настройка скрипта<br>
		<h3>Кнопки скачивания в поисковой системе и в раздачи персоны</h3>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Скриншоты настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowImagesButton"></div>
		</div>
	</div>
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
			<div class="col1">Сделать кнопки текстом ?</div>
			<div class="col2"><input type="checkbox" id="ChangeIconsToText"></div>
		</div>
		<div class="row">
			<div class="col1">Выделять раздачи ?</div>
			<div class="col2"><input type="checkbox" id="ShowMarkTorrents"></div>
		</div>
		<div class="row">
			<div class="col1">Текст выделения <b>через пробел</b></div>
			<div class="col2"><input type="text" placeholder="Пример: 4K 2160P" id="MarkValue"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="swal2-confirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
			$('body').append($wnd);
			$('#acemgn_script_save_settings').live('click', function() {
				GM_setValue('ShowImagesButton', $('#ShowImagesButton').is(':checked'));
				GM_setValue('ShowTorrentButton', $('#ShowTorrentButton').is(':checked'));
				GM_setValue('ConfirmDownloadTorrent', $('#ConfirmDownloadTorrent').is(':checked'));
				GM_setValue('ShowMagnetButton', $('#ShowMagnetButton').is(':checked'));
				GM_setValue('ConfirmDownloadMagnet', $('#ConfirmDownloadMagnet').is(':checked'));
				GM_setValue('ShowAcestreamButton', $('#ShowAcestreamButton').is(':checked'));
				GM_setValue('ChangeIconsToText', $('#ChangeIconsToText').is(':checked'));
				GM_setValue('ShowMarkTorrents', $('#ShowMarkTorrents').is(':checked'));
				GM_setValue('MarkValue', $('#MarkValue').val());
				obj.loadSettings();
				$('#acemgn_script_settings').toggle('fast');
				location.reload();
			});
		}
		this.Kinozal_SearchScript = function() {
			var obj = this;
			var domain = get_url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:[^.]+\.)?([^:\/\n\?\=]+)/im)[0];
			var mgt_reg = new RegExp('[a-zA-Z0-9]{40}', 'i');
			var film_name = $('H1 a').text().split(" / ");
			var film_full_name = $('H1 a').text();
			if (obj.settings.ShowMarkTorrents) {
				var mark_instance = new Mark(document.querySelectorAll("a.r0,a.r1,a.r2,a.r3,a.r4,a.r5,a.r6"));
				mark_instance.mark(obj.settings.MarkValue);
			}
			var table = $('.t_peer');
			var h = table.find('.mn');
			var signup = "Чтобы скачать, нужно зайти на сайт!";
			h.prepend((obj.settings.ShowAcestreamButton ? '<td class="z"></td>' : '') + (obj.settings.ShowMagnetButton ? '<td class="z"></td>' : '') + (obj.settings.ShowTorrentButton ? '<td class="z"></td>' : '') + (obj.settings.ShowImagesButton ? '<td class="z"></td>' : ''));
			table.find('tr').not(h).each(function(i, e) {
				var url = $(e).find('.nam a').attr('href');
				var uArgs = url.split('?')[1].split('&');
				var id = null;
				uArgs.forEach(function(el) {
					if (el.startsWith('id=')) {
						id = el.split('=')[1];
					}
				});
				if (id !== null) {
					var film_name = $(e).find('.nam a').text().split(" / ");
					if (obj.settings.ShowImagesButton) {
						var td4 = document.createElement('td');
						var button4 = document.createElement('button');
						$(e).prepend(td4);
						button4.setAttribute("id", "images_" + id);
						button4.setAttribute("class", "btnimg");
						button4.setAttribute("title", "Скриншоты");
						button4.innerHTML = '<i class="fas fa-question"></i>';
						td4.appendChild(button4);
					}
					if (obj.settings.ShowAcestreamButton) {
						var td3 = document.createElement('td');
						var button3 = document.createElement('button');
						$(e).prepend(td3);
						button3.setAttribute("id", "ace_" + id);
						button3.setAttribute("class", "btnca");
						button3.setAttribute("title", "Копировать для просмотра через AceStream");
						button3.innerHTML = (!obj.settings.ChangeIconsToText ? '<i class="fas fa-copy"></i>' : 'A');
						td3.appendChild(button3);
					}
					if (obj.settings.ShowMagnetButton) {
						var td2 = document.createElement('td');
						var button2 = document.createElement('button');
						$(e).prepend(td2);
						button2.setAttribute("id", "magnet_" + id);
						button2.setAttribute("class", "btndm");
						button2.setAttribute("title", "Скачать через Magnet");
						button2.innerHTML = (!obj.settings.ChangeIconsToText ? '<i class="fas fa-magnet"></i>' : 'M');
						td2.appendChild(button2);
					}
					if (obj.settings.ShowTorrentButton) {
						var td1 = document.createElement('td');
						var button1 = document.createElement('button');
						$(e).prepend(td1);
						button1.setAttribute("id", "torrent_" + id);
						button1.setAttribute("class", "btndt");
						button1.setAttribute("title", "Скачать Торрент файл");
						button1.innerHTML = (!obj.settings.ChangeIconsToText ? '<i class="fas fa-file-download"></i>' : 'T');
						td1.appendChild(button1);
					}
					$("#images_" + id).click(function() {
						$.ajax({
							url: '/details.php?id=' + id,
							type: "GET",
							dataType: "html"
						}).done(function(data) {
							var obj = $(data);
							var getinfo = obj.find('#tabs').html();
							var grel = obj.find(".lis li:contains(Релиз)").html();
							var gsrc = obj.find(".lis li:contains(Скриншоты)").html();
							var grel_id = [];
							var gsrc_id = [];
							var year1 = film_name[1].replace(/(.*)/gi, "$1");
							var year2 = film_name[2].replace(/(.*)/gi, "$1");
							var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
							var filmname = (get_year) ? film_name[0] + " " + year1 : film_name[0] + " " + film_name[1] + " " + year2;
							if (grel !== null && gsrc !== null) {
								grel_id = grel.match(/\d+/g)[1];
								gsrc_id = gsrc.match(/\d+/g)[1];
								$.ajax({
									url: '/get_srv_details.php?id=' + id + '&pagesd=' + grel_id,
									type: "GET",
									dataType: "html"
								}).done(function(drel) {
									$.ajax({
										url: '/get_srv_details.php?id=' + id + '&pagesd=' + gsrc_id,
										type: "GET",
										dataType: "html"
									}).done(function(dscr) {
										Swal.fire({
											width: 900,
											title: filmname.toUpperCase(),
											html: '<b style="color:red;">Информация о раздаче</b><br>' + getinfo + '<br><br><b style="color:red;">Релиз</b><br>' + drel + '<br><br><b style="color:red;">Скриншоты</b><br>' + dscr + '<br><br><button type="button" class="swal2-confirm swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(filmname + " трейлер русский") + '\')">ТРЕЙЛЕР</button><button type="button" id="imgcancel" class="swal2-deny swal2-styled">ЗАКРЫТЬ</button>',
											showCancelButton: false,
											showConfirmButton: false
										});
										$("#imgcancel").on("click", function(e) {
											Swal.close();
										});
									}).fail(function(jqXHR, textStatus, errorThrown) {});
								}).fail(function(jqXHR, textStatus, errorThrown) {});
							} else if (grel !== null && gsrc == null) {
								grel_id = grel.match(/\d+/g)[1];
								$.ajax({
									url: '/get_srv_details.php?id=' + id + '&pagesd=' + grel_id,
									type: "GET",
									dataType: "html"
								}).done(function(drel) {
									Swal.fire({
										width: 900,
										title: filmname.toUpperCase(),
										html: '<b style="color:red;">Информация о раздаче</b><br>' + getinfo + '<br><br><b style="color:red;">Релиз</b><br>' + drel + '<br><br><button type="button" class="swal2-confirm swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(filmname + " трейлер русский") + '\')">ТРЕЙЛЕР</button><button type="button" id="imgcancel" class="swal2-deny swal2-styled">ЗАКРЫТЬ</button>',
										showCancelButton: false,
										showConfirmButton: false
									})
									$("#imgcancel").on("click", function(e) {
										Swal.close();
									});
								}).fail(function(jqXHR, textStatus, errorThrown) {});
							} else if (grel == null && gsrc !== null) {
								gsrc_id = gsrc.match(/\d+/g)[1];
								$.ajax({
									url: '/get_srv_details.php?id=' + id + '&pagesd=' + gsrc_id,
									type: "GET",
									dataType: "html"
								}).done(function(dscr) {
									Swal.fire({
										width: 900,
										title: filmname.toUpperCase(),
										html: '<b style="color:red;">Информация о раздаче</b><br>' + getinfo + '<br><br><b style="color:red;">Скриншоты</b><br>' + dscr + '<br><br><button type="button" class="swal2-confirm swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(filmname + " трейлер русский") + '\')">ТРЕЙЛЕР</button><button type="button" id="imgcancel" class="swal2-deny swal2-styled">ЗАКРЫТЬ</button>',
										showCancelButton: false,
										showConfirmButton: false
									})
									$("#imgcancel").on("click", function(e) {
										Swal.close();
									});
								}).fail(function(jqXHR, textStatus, errorThrown) {});
							} else if (grel == null && gsrc == null) {
								Swal.fire({
									width: 900,
									title: filmname.toUpperCase(),
									html: '<b style="color:red;">Информация о раздаче</b><br>' + getinfo + '<br><br><button type="button" id="imgcancel" class="swal2-deny swal2-styled">ЗАКРЫТЬ</button>',
									showCancelButton: false,
									showConfirmButton: false
								})
								$("#imgcancel").on("click", function(e) {
									Swal.close();
								});
							}
						}).fail(function(jqXHR, textStatus, errorThrown) {});
					});
					$("#torrent_" + id).click(function() {
						if (obj.settings.ConfirmDownloadTorrent) {
							Swal.fire({
								title: "Скачать Торрент файл?",
								html: "Раздача:<br><b>" + film_name[0].toUpperCase() + "</b><br><br>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!",
								icon: 'question',
								showCancelButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								confirmButtonText: 'Да',
								cancelButtonText: 'Нет'
							}).then(function(result) {
								if (result.value) {
									$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
										if (s.toString().indexOf("signup.php") != -1) {
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
							$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
								if (s.toString().indexOf("signup.php") != -1) {
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
					});
					$("#magnet_" + id).click(function() {
						if (obj.settings.ConfirmDownloadMagnet) {
							Swal.fire({
								title: "Скачать через Magnet?",
								html: "Раздача:<br><b>" + film_name[0].toUpperCase() + "</b><br><br>Ваш рейтинг не упадёт, можете скачивать бесконечно!",
								icon: 'question',
								showCancelButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								confirmButtonText: 'Да',
								cancelButtonText: 'Нет'
							}).then(function(result) {
								if (result.value) {
									$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
										var hash = (s.toString().match(mgt_reg))[0];
										if (s.toString().indexOf("signup.php") != -1) {
											Toast.fire({
												icon: 'warning',
												html: signup
											})
										} else {
											window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(film_full_name)).substring(0, 1986);
											Toast.fire({
												icon: 'success',
												title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Magnet!'
											})
										}
									});
								}
							})
						} else {
							$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
								var hash = (s.toString().match(mgt_reg))[0];
								if (s.toString().indexOf("signup.php") != -1) {
									Toast.fire({
										icon: 'warning',
										html: signup
									})
								} else {
									window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(film_full_name)).substring(0, 1986);
									Toast.fire({
										icon: 'success',
										title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Magnet!'
									})
								}
							});
						}
					});
					$("#ace_" + id).click(async function() {
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
								title: film_name[0].toUpperCase(),
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
									var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
									if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
										var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
									} else {
										var search_film_name = film_name[0].toUpperCase();
									}
									var filmname = (get_year) ? search_film_name + " / " + year1 : search_film_name + " / " + year2;
									$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
										if (s.toString().indexOf("signup.php") != -1) {
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
											var copy_text = "";
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
									var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
									if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
										var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
									} else {
										var search_film_name = film_name[0].toUpperCase();
									}
									filmname = (get_year) ? search_film_name + " / " + year1 : search_film_name + " / " + year2;
									$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
										if (s.toString().indexOf("signup.php") != -1) {
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
											copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
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
								if (s.toString().indexOf("signup.php") != -1) {
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
									copy("\r\n#EXTINF:-1," + filmname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result + "&playlist_output_format_vod=hls&_idx=0&.mp4");
								}
							})
						}
					});
				}
			});
		}
		this.init = function() {
			this.loadSettings();
			this.addSettings();
			this.Kinozal_SearchScript();
		}
	}
	(new KinozalSearchSettingsScript()).init();
}
if (reg_kinozal_detailed.test(get_url) || mirror_kinozal_detailed.test(get_url)) {
	function KinozalDetailSettingsScript() {
		this.settings = {};
		this.loadSettings = function() {
			this.settings = {
				ShowTorrentButton: GM_getValue('ShowTorrentButton', true),
				ShowMagnetButton: GM_getValue('ShowMagnetButton', true),
				ShowAcestreamButton: GM_getValue('ShowAcestreamButton', true),
				ConfirmDownloadTorrent: GM_getValue('ConfirmDownloadTorrent', true),
				ConfirmDownloadMagnet: GM_getValue('ConfirmDownloadMagnet', true),
				ShowHelpButton: GM_getValue('ShowHelpButton', true),
				DetailedInfoButtons: GM_getValue('DetailedInfoButtons', true)
			};
		}
		this.toggleSettings = function() {
			var $sett_wnd = $('#acemgn_script_settings'),
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
			if (this.settings.DetailedInfoButtons) {
				$('#DetailedInfoButtons').attr('checked', true);
			}
			$('#acemgn_script_settings').css({
				'left': x,
				'top': y
			}).toggle('fast');
		}
		this.addSettings = function() {
			var $tab = $('<li style="padding-left:14px;"><span class="bulet"></span><a href="javascript:;" title="Настройка скрипта">Настройка скрипта</a></li>');
			var obj = this;
			$tab.click(function() {
				obj.toggleSettings();
			});
			$('ul.men:first').append($tab);
			var $wnd = $(`
<div id="acemgn_script_settings" style="display: none">
	<div class="header">Настройка скрипта<br><h3>Кнопки скачивания внутри раздачи</h3></div>
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
		<div class="row">
			<div class="col1">Сделать простыми кнопки скачивания?</div>
			<div class="col2"><input type="checkbox" id="DetailedInfoButtons"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="swal2-confirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
			$('body').append($wnd);
			$('#acemgn_script_save_settings').live('click', function() {
				GM_setValue('ShowTorrentButton', $('#ShowTorrentButton').is(':checked'));
				GM_setValue('ConfirmDownloadTorrent', $('#ConfirmDownloadTorrent').is(':checked'));
				GM_setValue('ShowMagnetButton', $('#ShowMagnetButton').is(':checked'));
				GM_setValue('ConfirmDownloadMagnet', $('#ConfirmDownloadMagnet').is(':checked'));
				GM_setValue('ShowAcestreamButton', $('#ShowAcestreamButton').is(':checked'));
				GM_setValue('ShowHelpButton', $('#ShowHelpButton').is(':checked'));
				GM_setValue('DetailedInfoButtons', $('#DetailedInfoButtons').is(':checked'));
				obj.loadSettings();
				$('#acemgn_script_settings').toggle('fast');
				location.reload();
			});
		}
		this.Kinozal_MainScript = function() {
			var obj = this;
			var set_buttons = document.querySelector("table.w100p");
			var reg_id = new RegExp('id=[0-9]{6,10}', 'ig');
			var id = (get_url.match(reg_id)[0]).substr(3);
			var domain = get_url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:[^.]+\.)?([^:\/\n\?\=]+)/im)[0];
			var mgt_reg = new RegExp('[a-zA-Z0-9]{40}', 'i');
			var film_name = $('H1 a').text().split(" / ");
			var film_full_name = $('.mn_wrap > div > h1 > a').text();
			var signup = "Чтобы скачать, нужно зайти на сайт!";
			var txt_dl_torrent_info = '<b><font color="#cc0000">Cкачать торрент-файл:</font></b><br>Для того, чтобы скачать эту раздачу - скачайте торрент-файл и запустите его при помощи клиента.';
			var txt_dl_magnet_info = '<b><font color="#0000cc">Cкачать через Magnet:</font></b><br>Скачивайте сколько угодно, ваш рейтинг не изменится, так как данный метод не затрагивает ваш профиль!';
			var txt_cp_acestream_info = '<b><font color="#00cc00">Смотреть через ACESTREAM:</font></b><br>Смотрите через Acestream ( На Android TV, в Планшете, в Телефоне )';
			set_buttons.classList.add('bx1');
			if (obj.settings.DetailedInfoButtons) {
				set_buttons.innerHTML = `<tbody id="copy_form">
	<tr>
		<td class="nw">
		${obj.settings.ShowTorrentButton ? ' <button id="Torrent" type="button" class="btndt">TORRENT</button>' : ''}
		${obj.settings.ShowMagnetButton ? ' <button id="Magnet" type="button" class="btndm">MAGNET</button>' : ''}
		${obj.settings.ShowAcestreamButton ? ' <button id="acestream" type="button" class="btnca">ACESTREAM</button>' : ''}
		</td>
	</tr>
${obj.settings.ShowHelpButton ? ' <tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : ''}
</tbody>`;
			} else {
				set_buttons.innerHTML = `<tbody id="copy_form">
	${obj.settings.ShowTorrentButton ? '<tr><td style="width: 400px;" class="nw"><button id="Torrent" type="button" class="btndt">Cкачать торрент-файл</button></td><td>' + txt_dl_torrent_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowMagnetButton ? '<tr><td style="width: 400px;" class="nw"><button id="Magnet" type="button" class="btndm">Cкачать через Magnet</button></td><td>' + txt_dl_magnet_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowAcestreamButton ? '<tr><td style="width: 400px;" class="nw"><button id="acestream" type="button" class="btnca">ACESTREAM</button></td><td>' + txt_cp_acestream_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowHelpButton ? '<tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : ''}
</tbody>`;
			}
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
							title: film_name[0].toUpperCase(),
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
								var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
								if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
									var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
								} else {
									var search_film_name = film_name[0].toUpperCase();
								}
								var filmname = (get_year) ? search_film_name + " / " + year1 : search_film_name + " / " + year2;
								$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") != -1) {
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
										var copy_text = "";
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
								var get_year = new RegExp('^[0-9]+$').exec(film_name[1]);
								if (film_name[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
									var search_film_name = film_name[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
								} else {
									var search_film_name = film_name[0].toUpperCase();
								}
								filmname = (get_year) ? search_film_name + " / " + year1 : search_film_name + " / " + year2;
								$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") != -1) {
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
										copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
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
						$.get(domain + "/get_srv_details.php?id=" + id + "&action=2", function(s) {
							if (s.toString().indexOf("signup.php") != -1) {
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
								copy("\r\n#EXTINF:-1," + filmname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result + "&playlist_output_format_vod=hls&_idx=0&.mp4");
							}
						})
					}
				} else if (target.id === 'Magnet') {
					if (obj.settings.ConfirmDownloadMagnet) {
						Swal.fire({
							title: "Скачать через Magnet?",
							html: "Раздача:<br><b>" + film_name[0].toUpperCase() + "</b><br><br>Ваш рейтинг не упадёт, можете скачивать бесконечно!",
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Да',
							cancelButtonText: 'Нет'
						}).then(function(result) {
							if (result.value) {
								$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
									var hash = (s.toString().match(mgt_reg))[0];
									if (s.toString().indexOf("signup.php") != -1) {
										Toast.fire({
											icon: 'warning',
											html: signup
										})
									} else {
										window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(film_full_name)).substring(0, 1986);
										Toast.fire({
											icon: 'success',
											title: 'Раздача ( ' + film_name[0].toUpperCase() + ' ) скачивается через Magnet!'
										})
									}
								});
							}
						})
					} else {
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
							var hash = (s.toString().match(mgt_reg))[0];
							if (s.toString().indexOf("signup.php") != -1) {
								Toast.fire({
									icon: 'warning',
									html: signup
								})
							} else {
								window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(film_full_name)).substring(0, 1986);
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
							html: "Раздача:<br><b>" + film_name[0].toUpperCase() + "</b><br><br>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!",
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Да',
							cancelButtonText: 'Нет'
						}).then(function(result) {
							if (result.value) {
								$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
									if (s.toString().indexOf("signup.php") != -1) {
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
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") != -1) {
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
			document.getElementById("LibTorrent").click();
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
}
if (reg_rutor.test(get_url)) {
	function RutorScriptSettingsScript() {
		this.settings = {};
		this.loadSettings = function() {
			if (GM_getValue("ShowTorrentButton") == undefined) {
				GM_setValue("ShowTorrentButton", true);
			}
			if (GM_getValue("ShowMagnetButton") == undefined) {
				GM_setValue("ShowMagnetButton", true);
			}
			if (GM_getValue("ShowAcestreamButton") == undefined) {
				GM_setValue("ShowAcestreamButton", true);
			}
			if (GM_getValue("ConfirmDownloadTorrent") == undefined) {
				GM_setValue("ConfirmDownloadTorrent", true);
			}
			if (GM_getValue("ConfirmDownloadMagnet") == undefined) {
				GM_setValue("ConfirmDownloadMagnet", true);
			}
			if (GM_getValue("ChangeIconsToText") == undefined) {
				GM_setValue("ChangeIconsToText", false);
			}
			if (GM_getValue("ShowMarkTorrents") == undefined) {
				GM_setValue("ShowMarkTorrents", false);
			}
			if (GM_getValue("MarkValue") == undefined) {
				GM_setValue("MarkValue", '4K 2160P');
			}
			this.settings = {
				ShowTorrentButton: GM_getValue('ShowTorrentButton', true),
				ShowMagnetButton: GM_getValue('ShowMagnetButton', true),
				ShowAcestreamButton: GM_getValue('ShowAcestreamButton', true),
				ConfirmDownloadTorrent: GM_getValue('ConfirmDownloadTorrent', true),
				ConfirmDownloadMagnet: GM_getValue('ConfirmDownloadMagnet', true),
				ChangeIconsToText: GM_getValue('ChangeIconsToText', false),
				ShowMarkTorrents: GM_getValue('ShowMarkTorrents', false),
				MarkValue: GM_getValue('MarkValue', '4K 2160P')
			};
		}
		this.toggleSettings = function() {
			var $sett_wnd = $('#acemgn_script_settings'),
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
			if (this.settings.ChangeIconsToText) {
				$('#ChangeIconsToText').attr('checked', true);
			}
			if (this.settings.ShowMarkTorrents) {
				$('#ShowMarkTorrents').attr('checked', true);
			}
			$('#MarkValue').val(this.settings.MarkValue);
			$('#acemgn_script_settings').css({
				'left': x,
				'top': y
			}).toggle('fast');
		}
		this.addSettings = function() {
			var $tab = $('<a href="javascript:;" class="menu_b" title="Настройка скрипта"><div>Настройка</div></a>');
			var obj = this;
			$tab.click(function() {
				obj.toggleSettings();
			});
			$('#menu').append($tab);
			var $wnd = $(`
<div id="acemgn_script_settings" style="display: none">
	<div class="header">Настройка скрипта<br>
		<h3>Кнопки скачивания в поисковой системе и в раздачи персоны</h3>
	</div>
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
			<div class="col1">Сделать кнопки текстом ?</div>
			<div class="col2"><input type="checkbox" id="ChangeIconsToText"></div>
		</div>
		<div class="row">
			<div class="col1">Выделять раздачи ?</div>
			<div class="col2"><input type="checkbox" id="ShowMarkTorrents"></div>
		</div>
		<div class="row">
			<div class="col1">Текст выделения <b>через пробел</b></div>
			<div class="col2"><input type="text" placeholder="Пример: 4K 2160P" id="MarkValue"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="swal2-confirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
			$('body').append($wnd);
			$('#acemgn_script_save_settings').live('click', function() {
				GM_setValue('ShowTorrentButton', $('#ShowTorrentButton').is(':checked'));
				GM_setValue('ConfirmDownloadTorrent', $('#ConfirmDownloadTorrent').is(':checked'));
				GM_setValue('ShowMagnetButton', $('#ShowMagnetButton').is(':checked'));
				GM_setValue('ConfirmDownloadMagnet', $('#ConfirmDownloadMagnet').is(':checked'));
				GM_setValue('ShowAcestreamButton', $('#ShowAcestreamButton').is(':checked'));
				GM_setValue('ChangeIconsToText', $('#ChangeIconsToText').is(':checked'));
				GM_setValue('ShowMarkTorrents', $('#ShowMarkTorrents').is(':checked'));
				GM_setValue('MarkValue', $('#MarkValue').val());
				obj.loadSettings();
				$('#acemgn_script_settings').toggle('fast');
				location.reload();
			});
		}
		this.RutorScript = function() {
			var obj = this;
			var get_file_count = $("table#details").children("tbody").children("tr:nth-child(12)").children("td.header").children("span").children("u").text().match(/\d+/);
			var get_cat = $("table#details > tbody > tr > td:nth-child(2) > a").text();
			//alert(get_cat);
			var hash_result = document.getElementById('download').getElementsByTagName('a')[0].getAttribute("href").match(/magnet:\?xt=urn:btih:([a-z\d]{40})&/im)[1];
			var set_buttons = document.querySelector("#download");
			var filmname = $('div#all > H1').text();
			set_buttons.innerHTML += '<table id="copy_form">' + '<tbody>' + '<tr>' + '<td><button id="LibTorrent" type="button" class="btndt">LIBTORRENT</button> <button id="Magnet" type="button" class="btndm">MAGNET</button> <button id="acestream" type="button" class="btnca">ACESTREAM</button></td>' + '</tr>' + '<tr>' + '<td colspan="2"><b style="color:#cc0000">Скрипт предназначен для копирования ссылок LIBTORRENT и ACESTREAM.<br>Скопированные ссылки вкидывайте в свой <font style="color:#00cc00">m3u8</font> плейлист</b></td>' + '</tr>' + '</tbody>' + '</table>';
			document.getElementById('copy_form').addEventListener('click', async function(evt) {
				var target = evt.target;
				if (target.id === 'acestream') {
					if (get_cat.match(/Зарубежные фильмы|Наши фильмы|Научно-популярные фильмы|Зарубежные сериалы|Наши сериалы|Телевизор|Аниме/gi) && get_file_count > 1) {
						if (get_cat.match(/(логия)/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
							var selbtn2 = "ОДИН ФИЛЬМ";
						} else if (get_cat.match(/(выпуск)/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
							var selbtn2 = "ОДИН ВЫПУСК";
						} else if (get_cat.match(/серии|сезон/gi)) {
							var selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
							var selbtn2 = "ОДНА СЕРИЯ";
						} else if (get_cat.match(/этапы/gi)) {
							var selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
							var selbtn2 = "ОДИН ЭТАП";
						} else {
							var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
							var selbtn2 = "ОДИН ВЫПУСК";
						}
						Swal.fire({
							title: filmname.toUpperCase(),
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
								title: filmname.toUpperCase(),
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
								if (get_cat.match(/(логия)/gi)) {
									var number_copy = formValues + " " + declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
								} else if (get_cat.match(/(выпуск)/gi)) {
									var number_copy = formValues + " " + declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
								} else if (get_cat.match(/серии|сезон/gi)) {
									var number_copy = formValues + " " + declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
								} else if (get_cat.match(/этапы/gi)) {
									var number_copy = formValues + " " + declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
								} else {
									var number_copy = formValues + " " + declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
								}
								var copy_text = "";
								var i = 0;
								while (i < formValues) {
									var set_i = 1 + i;
									if (get_cat.match(/(логия)/gi)) {
										var copyname = filmname + " / " + set_i + "-й ФИЛЬМ";
									} else if (get_cat.match(/(выпуск)/gi)) {
										var copyname = filmname + " / " + set_i + " ВЫПУСК";
									} else if (get_cat.match(/серии|сезон/gi)) {
										var copyname = filmname + " / " + set_i + " СЕРИЯ";
									} else if (get_cat.match(/этапы/gi)) {
										var copyname = filmname + " / " + set_i + " ЭТАП";
									} else {
										var copyname = filmname + " / " + set_i + " ВЫПУСК";
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
						$("#2").on("click", async function(e) {
							const {
								value: formValues
							} = await Swal.fire({
								title: filmname.toUpperCase(),
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
								var set_i = formValues - 1;
								if (get_cat.match(/(логия)/gi)) {
									var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
								} else if (get_cat.match(/(выпуск)/gi)) {
									var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
								} else if (get_cat.match(/серии|сезон/gi)) {
									var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
								} else if (get_cat.match(/этапы/gi)) {
									var number_copy = formValues + " ЭТАП СКОПИРОВАН !";
								} else {
									var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
								}
								if (get_cat.match(/(логия)/gi)) {
									var copyname = filmname + " / " + formValues + "-й ФИЛЬМ";
								} else if (get_cat.match(/(выпуск)/gi)) {
									var copyname = filmname + " / " + formValues + " ВЫПУСК";
								} else if (get_cat.match(/серии|сезон/gi)) {
									var copyname = filmname + " / " + formValues + " СЕРИЯ";
								} else if (get_cat.match(/этапы/gi)) {
									var copyname = filmname + " / " + formValues + " ЭТАП";
								} else {
									var copyname = filmname + " / " + formValues + " ВЫПУСК";
								}
								copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
								Toast.fire({
									icon: 'success',
									title: number_copy
								})
							}
						});
						$("#cancel").on("click", function(e) {
							Swal.close();
						});
					} else {
						Toast.fire({
							icon: 'success',
							title: 'Раздача ( ' + filmname.toUpperCase() + ' ) скопирована!2'
						})
						copy("\r\n#EXTINF:-1," + filmname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash_result + "&playlist_output_format_vod=hls&_idx=0&.mp4");
					}
				} else if (target.id === 'Magnet') {
					if (obj.settings.ConfirmDownloadMagnet) {
						Swal.fire({
							title: "Скачать через Magnet?",
							html: "Раздача:<br><b>" + filmname.toUpperCase(),
							icon: 'question',
							showCancelButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Да',
							cancelButtonText: 'Нет'
						}).then(function(result) {
							if (result.value) {
								window.location.href = "magnet:?xt=urn:btih:" + hash_result + ('&dn=' + encodeURIComponent(filmname)).substring(0, 1986);
								Toast.fire({
									icon: 'success',
									title: 'Раздача ( ' + filmname.toUpperCase() + ' ) скачивается через Magnet!'
								})
							}
						})
					} else {
						window.location.href = "magnet:?xt=urn:btih:" + hash_result + ('&dn=' + encodeURIComponent(filmname)).substring(0, 1986);
						Toast.fire({
							icon: 'success',
							title: 'Раздача ( ' + filmname.toUpperCase() + ' ) скачивается через Magnet!'
						})
					}
				}
			}, false);
		}
		this.init = function() {
			this.loadSettings();
			this.addSettings();
			this.RutorScript();
		}
	}
	(new RutorScriptSettingsScript()).init();
}
