// ==UserScript==
// @name Kinozal+Rutor | Кнопки скачивания (Torrent/Magnet/Acestream)
// @description Torrent - Всего лишь заменяет старую кнопку на новую / Magnet - Скачать без учёта рейтинга/скачивания / AceStream - Смотреть через AceStream ( Актуально для Android TV/Планшета/Телефона ) / Настройки - Настраивайте под себя, какие кнопки показывать, а какие убрать, выделение раздачи ( 4K 2160p 1080p ). 
// @namespace none
// @version 1.0.13
// @author https://greasyfork.org/ru/users/173690
// @author https://greasyfork.org/scripts/40843
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAD1BMVEU7R4CAAAD4+/z9787///8A0Su5AAAASUlEQVR4AXWPAQrEMBACzen/33wdkGILFZQdSFxWkZKoyWBsd5JXvFgMfC6ZLBs0pq8Mtq8f0Bcbw9N3HvuI8i14sAt/e8/73j/4FwHuDyR5AQAAAABJRU5ErkJggg==
// @include /(https?:\/\/)?(www\.)?kinozal\.(me|tv|guru|website)\/*/
// @include /(https?:\/\/)?(www\.)?kino-zal\.site\/*/
// @include /(https?:\/\/)?(www\.)?rutor\.(info|is)\/*/
// @require https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
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
@font-face{font-family:"Open Sans";font-style:normal;font-weight:400;src:local("Open Sans"),local(OpenSans),url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}
 
.t_peer td.swalbtn {width: 45px;text-align:center;}
.swal2-styled.swal2-cancel,.swal2-styled.swal2-confirm,.swal2-styled.swal2-deny,.swal2-styled.swal2-deny{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
.swal2-content {font-size: 14px;font-family: "Open Sans";font-style:normal;text-align: left;color: #000;}
.menuinfo .floatright {float: right;color:#ff0000;}
.menuinfo {font-weight:bold;}
.fnm-title {font-weight:bold;font-family:Open Sans;text-transform:uppercase;font-size:35px;color: hsl(0deg 70% 55%);text-shadow: -1px -1px 0 hsl(0deg 70% 35%), -2px -2px 1px hsl(0deg 70% 35%);}
 
BUTTON.btndt,BUTTON.btncnc{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#d92638;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btnytb{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:18px;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#d92638;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndt:hover,BUTTON.btnytb:hover,BUTTON.btncnc:hover{color:#fff;background-color:#c32232;}
BUTTON.btndt:focus,BUTTON.btndt:active,BUTTON.btndt:visited,BUTTON.btnytb:focus,BUTTON.btnytb:active,BUTTON.btncnc:focus,BUTTON.btncnc:active{color:#fff;background-color:#ad1f2d;}
 
BUTTON.btndm,.btnconfirm{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#2778C4;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btndm:hover,.btnconfirm:hover{color:#fff;background-color:#236CB0;}
BUTTON.btndm:focus,BUTTON.btndm:active,BUTTON.btndm:visited,.btnconfirm:focus,.btnconfirm:active{color:#fff;background-color:#1F609D;}
 
BUTTON.btnace{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;background-color:#4FC823;border:none;text-shadow:0 0 1px #000,1px 1px 1px #000}
BUTTON.btnace:hover{color:#fff;background-color:#47B41F;}
BUTTON.btnace:focus,BUTTON.btnace:active,BUTTON.btnace:visited{color:#fff;background-color:#3fa01c;}
 
#acemgn_script_settings{padding:5px;font-family:tahoma,arial,verdana,sans-serif,Lucida Sans;position:fixed;left:0;top:0;background-color:#fff;border:1px solid #000;border-radius:4px 4px 4px 4px;-moz-border-radius:4px;-webkit-border-radius:4px 4px 4px 4px;-webkit-box-shadow:0 0 0 1px #000;-moz-box-shadow:0 0 0 1px #000;box-shadow:0 0 0 1px #000}
#acemgn_script_settings .header{font-size:16px;padding:5px;color:red;font-weight:bold;text-align:center}
#acemgn_script_settings .title{text-transform:uppercase;font-size:14px;color:#000;font-weight:bold;text-align:center}
#acemgn_script_settings .fields{font-size:14px;text-transform:uppercase}
#acemgn_script_settings .fields .row{clear:both;padding:5px 0}
#acemgn_script_settings .fields .row .col1{width:250px;float:left;padding:0 20px}
#acemgn_script_settings .fields .row .col2{width:150px;float:left}
#acemgn_script_settings .knzl-color{max-width:70px;max-height:20px}
#acemgn_script_settings input[type=text]{width:90%}
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
 
	function truncString(str, max, add) {
		add = add || '...';
		return (typeof str === 'string' && str.length > max ? str.substring(0, max) + add : str);
	};
 
	function declOfNum(n, text_forms) {
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20) {
			return n + " " + text_forms[2];
		}
		if (n1 > 1 && n1 < 5) {
			return n + " " + text_forms[1];
		}
		if (n1 == 1) {
			return n + " " + text_forms[0];
		}
		return n + " " + text_forms[2];
	}
	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-start',
		showConfirmButton: false,
		timer: 5000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	});
	var get_url = location.href;
	var reg_kinozal_search = new RegExp('(kinozal.(me|tv|guru|website)|kino-zal.site)\/(browse|persons).php', 'i');
	var reg_kinozal_detailed = new RegExp('(kinozal.(me|tv|guru|website)|kino-zal.site)\/(details|comment).php', 'i');
	var reg_rutor = new RegExp('rutor.(info|is)/torrent/*', 'i');
	if (reg_kinozal_search.test(get_url)) {
		function KinozalSearchSettingsScript() {
			this.settings = {};
			this.loadSettings = function() {
				if (GM_getValue("ShowAboutFile") == undefined) {
					GM_setValue("ShowAboutFile", true);
				}
				if (GM_getValue("ShowMainInfo") == undefined) {
					GM_setValue("ShowMainInfo", true);
				}
				if (GM_getValue("ShowRelease") == undefined) {
					GM_setValue("ShowRelease", true);
				}
				if (GM_getValue("ShowScreenshots") == undefined) {
					GM_setValue("ShowScreenshots", true);
				}
				if (GM_getValue("ShowTorrentButtonS") == undefined) {
					GM_setValue("ShowTorrentButtonS", false);
				}
				if (GM_getValue("ShowTorrentInfoS") == undefined) {
					GM_setValue("ShowTorrentInfoS", true);
				}
				if (GM_getValue("ShowMagnetButtonS") == undefined) {
					GM_setValue("ShowMagnetButtonS", true);
				}
				if (GM_getValue("ShowMagnetInfoS") == undefined) {
					GM_setValue("ShowMagnetInfoS", true);
				}
				if (GM_getValue("ShowAcestreamButtonS") == undefined) {
					GM_setValue("ShowAcestreamButtonS", false);
				}
				if (GM_getValue("ChangeIconsToTextS") == undefined) {
					GM_setValue("ChangeIconsToTextS", false);
				}
				if (GM_getValue("ShowMarkTorrentsS") == undefined) {
					GM_setValue("ShowMarkTorrentsS", false);
				}
				if (GM_getValue("MarkValueS") == undefined) {
					GM_setValue("MarkValueS", '4K 2160P');
				}
				if (GM_getValue("SwalDetailedInfoWidthS") == undefined) {
					GM_setValue("SwalDetailedInfoWidthS", '1100px');
				}
				this.settings = {
					ShowAboutFile: GM_getValue('ShowAboutFile', true),
					ShowMainInfo: GM_getValue('ShowMainInfo', true),
					ShowRelease: GM_getValue('ShowRelease', true),
					ShowScreenshots: GM_getValue('ShowScreenshots', true),
					ShowTorrentButtonS: GM_getValue('ShowTorrentButtonS', false),
					ShowTorrentInfoS: GM_getValue('ShowTorrentInfoS', true),
					ShowMagnetButtonS: GM_getValue('ShowMagnetButtonS', true),
					ShowMagnetInfoS: GM_getValue('ShowMagnetInfoS', true),
					ShowAcestreamButtonS: GM_getValue('ShowAcestreamButtonS', false),
					ChangeIconsToTextS: GM_getValue('ChangeIconsToTextS', false),
					ShowMarkTorrentsS: GM_getValue('ShowMarkTorrentsS', false),
					MarkValueS: GM_getValue('MarkValueS', '4K 2160P'),
					SwalDetailedInfoWidthS: GM_getValue('SwalDetailedInfoWidthS', '1100px')
				};
			}
			this.toggleSettings = function() {
				var $sett_wnd = $('#acemgn_script_settings'),
					x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
					y = parseInt(($(window).height() - $sett_wnd.height()) / 2);
				if (this.settings.ShowAboutFile) {
					$('#ShowAboutFile').attr('checked', true);
				}
				if (this.settings.ShowMainInfo) {
					$('#ShowMainInfo').attr('checked', true);
				}
				if (this.settings.ShowRelease) {
					$('#ShowRelease').attr('checked', true);
				}
				if (this.settings.ShowScreenshots) {
					$('#ShowScreenshots').attr('checked', true);
				}
				if (this.settings.ShowTorrentButtonS) {
					$('#ShowTorrentButtonS').attr('checked', true);
				}
				if (this.settings.ShowTorrentInfoS) {
					$('#ShowTorrentInfoS').attr('checked', true);
				}
				if (this.settings.ShowMagnetButtonS) {
					$('#ShowMagnetButtonS').attr('checked', true);
				}
				if (this.settings.ShowMagnetInfoS) {
					$('#ShowMagnetInfoS').attr('checked', true);
				}
				if (this.settings.ShowAcestreamButtonS) {
					$('#ShowAcestreamButtonS').attr('checked', true);
				}
				if (this.settings.ChangeIconsToTextS) {
					$('#ChangeIconsToTextS').attr('checked', true);
				}
				if (this.settings.ShowMarkTorrentsS) {
					$('#ShowMarkTorrentsS').attr('checked', true);
				}
				$('#MarkValueS').val(this.settings.MarkValueS);
				$('#SwalDetailedInfoWidthS').val(this.settings.SwalDetailedInfoWidthS);
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
			<div class="title">Торрент кнопка</div>
			<div class="col1">Показать кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowTorrentButtonS"></div>
		</div>
		<div class="row">
			<div class="col1">Показать информацию?</div>
			<div class="col2"><input type="checkbox" id="ShowTorrentInfoS"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Магнит кнопка</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowMagnetButtonS"></div>
		</div>
		<div class="row">
			<div class="col1">Показать информацию?</div>
			<div class="col2"><input type="checkbox" id="ShowMagnetInfoS"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Acestream кнопка</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowAcestreamButtonS"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Выделение раздач</div>
			<div class="col1">Выделять раздачи ?</div>
			<div class="col2"><input type="checkbox" id="ShowMarkTorrentsS"></div>
		</div>
		<div class="row">
			<div class="col1">Текст выделения <b>через пробел</b></div>
			<div class="col2"><input type="text" placeholder="Пример: 4K 2160P" id="MarkValueS"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Остальные настройки</div>
			<div class="col1">Поменять кнопки текстом ?</div>
			<div class="col2"><input type="checkbox" id="ChangeIconsToTextS"></div>
		</div>
		<div class="row">
			<div class="col1">Ширина окна информации<br>(100% на вест экран)</div>
			<div class="col2"><input type="text" placeholder="Пример: 800px или 100%" id="SwalDetailedInfoWidthS"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Информация о раздаче</div>
			<div class="col1">Показать описание?</div>
			<div class="col2"><input type="checkbox" id="ShowAboutFile"></div>
		</div>
		<div class="row">
			<div class="col1">Показать техданные?</div>
			<div class="col2"><input type="checkbox" id="ShowMainInfo"></div>
		</div>
		<div class="row">
			<div class="col1">Показать релиз?</div>
			<div class="col2"><input type="checkbox" id="ShowRelease"></div>
		</div>
		<div class="row">
			<div class="col1">Показать скриншоты?</div>
			<div class="col2"><input type="checkbox" id="ShowScreenshots"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="btnconfirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
				$('body').append($wnd);
				$('#acemgn_script_save_settings').live('click', function() {
					GM_setValue('ShowAboutFile', $('#ShowAboutFile').is(':checked'));
					GM_setValue('ShowMainInfo', $('#ShowMainInfo').is(':checked'));
					GM_setValue('ShowRelease', $('#ShowRelease').is(':checked'));
					GM_setValue('ShowScreenshots', $('#ShowScreenshots').is(':checked'));
					GM_setValue('ShowTorrentButtonS', $('#ShowTorrentButtonS').is(':checked'));
					GM_setValue('ShowTorrentInfoS', $('#ShowTorrentInfoS').is(':checked'));
					GM_setValue('ShowMagnetButtonS', $('#ShowMagnetButtonS').is(':checked'));
					GM_setValue('ShowMagnetInfoS', $('#ShowMagnetInfoS').is(':checked'));
					GM_setValue('ShowAcestreamButtonS', $('#ShowAcestreamButtonS').is(':checked'));
					GM_setValue('ChangeIconsToTextS', $('#ChangeIconsToTextS').is(':checked'));
					GM_setValue('ShowMarkTorrentsS', $('#ShowMarkTorrentsS').is(':checked'));
					GM_setValue('MarkValueS', $('#MarkValueS').val());
					GM_setValue('SwalDetailedInfoWidthS', $('#SwalDetailedInfoWidthS').val());
					obj.loadSettings();
					$('#acemgn_script_settings').toggle('fast');
					location.reload();
				});
			}
			this.Kinozal_SearchScript = function() {
				var obj = this;
				var domain = get_url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:[^.]+\.)?([^:\/\n\?\=]+)/im)[0];
				var mgt_reg = new RegExp('[a-zA-Z0-9]{40}', 'i');
				var swal_width = obj.settings.SwalDetailedInfoWidthS;
				var SwalConfirmText = "СКАЧАТЬ";
				var SwalCancelText = "ОТМЕНА";
				if (obj.settings.ShowMarkTorrentsS) {
					var mark_instance = new Mark(document.querySelectorAll("a.r0,a.r1,a.r2,a.r3,a.r4,a.r5,a.r6"));
					mark_instance.mark(obj.settings.MarkValueS);
				}
				var table = $('.t_peer');
				var h = table.find('.mn');
				var signup = "Чтобы скачать, нужно зайти на сайт!";
				h.prepend((obj.settings.ShowAcestreamButtonS ? '<td class="z"></td>' : '') + (obj.settings.ShowMagnetButtonS ? '<td class="z"></td>' : '') + (obj.settings.ShowTorrentButtonS ? '<td class="z"></td>' : ''));
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
						var ssh_af = obj.settings.ShowAboutFile;
						var ssh_mi = obj.settings.ShowMainInfo;
						var ssh_rel = obj.settings.ShowRelease;
						var ssh_scr = obj.settings.ShowScreenshots;
						var ssh_aceb = obj.settings.ShowAcestreamButtonS;
						var ssh_mgbtn = obj.settings.ShowMagnetButtonS;
						var ssh_mgi = obj.settings.ShowMagnetInfoS;
						var ssh_trbtn = obj.settings.ShowTorrentButtonS;
						var ssh_tri = obj.settings.ShowTorrentInfoS;
						var gfname = $(e).find('.nam a').text().split(" / ");
						var getfname = gfname[0].toUpperCase();
						var getfnames = gfname[1].toUpperCase();
						if (ssh_aceb) {
							var td3 = document.createElement('td');
							var button3 = document.createElement('button');
							$(e).prepend(td3);
							button3.setAttribute("id", "ace_" + id);
							button3.setAttribute("class", "btnace");
							button3.setAttribute("title", "Копировать для просмотра через AceStream");
							button3.innerHTML = (!obj.settings.ChangeIconsToTextS ? '<i class="fas fa-copy"></i>' : 'A');
							td3.setAttribute("class", "swalbtn");
							td3.appendChild(button3);
						}
						if (ssh_mgbtn) {
							var td2 = document.createElement('td');
							var button2 = document.createElement('button');
							$(e).prepend(td2);
							button2.setAttribute("id", "magnet_" + id);
							button2.setAttribute("class", "btndm");
							button2.setAttribute("title", "Скачать через Magnet");
							button2.innerHTML = (!obj.settings.ChangeIconsToTextS ? '<i class="fas fa-magnet"></i>' : 'M');
							td2.setAttribute("class", "swalbtn");
							td2.appendChild(button2);
						}
						if (ssh_trbtn) {
							var td1 = document.createElement('td');
							var button1 = document.createElement('button');
							$(e).prepend(td1);
							button1.setAttribute("id", "torrent_" + id);
							button1.setAttribute("class", "btndt");
							button1.setAttribute("title", "Скачать Торрент файл");
							button1.innerHTML = (!obj.settings.ChangeIconsToTextS ? '<i class="fas fa-file-download"></i>' : 'T');
							td1.setAttribute("class", "swalbtn");
							td1.appendChild(button1);
						}
						$("#torrent_" + id).click(function() {
							$.ajax({
								url: domain + '/get_srv_details.php?id=' + id + '&action=2'
							}).done(function(s) {
								if (s.toString().indexOf("signup.php") != -1) {
									Toast.fire({
										icon: 'warning',
										html: signup
									});
								} else {
									if (ssh_tri) {
										$.ajax({
											url: '/details.php?id=' + id
										}).done(function(data) {
											var obj1 = $(data);
											var getinfo = obj1.find('#tabs').html();
											var gsimilarfiles = obj1.find('#tabs2 td.w90p').html();
											var grel = obj1.find(".lis li:contains(Релиз)").html();
											var gscr = obj1.find(".lis li:contains(Скриншоты)").html();
											var gmenuinfo1 = obj1.find(".mn1_menu ul.men li a:contains(Раздают)").html();
											var gmenuinfo2 = obj1.find(".mn1_menu ul.men li a:contains(Скачивают)").html();
											var gmenuinfo3 = obj1.find(".mn1_menu ul.men li a:contains(Скачали)").html();
											var gmenuinfo4 = obj1.find(".mn1_menu ul.men li a:contains(Список файлов)").html();
											var getmyacc_id = obj1.find(".menu ul.men li.tp2.center.b").html().match(/userdetails\.php\?id=(\d+)/)[1];
											var gaboutfile = obj1.find("div.bx1.justify p").html();
											var gaboutfile1 = obj1.find("div.bx1.justify h2").html();
											var g_movie = gaboutfile.indexOf("О фильме:") !== -1;
											var gimg = '<img src="' + (obj1.find("li.img").html().match(/img.*?src=("|')(.*?)\1/i)[2]) + '" style="display: block;width:250px;padding:0px 0px 10px 0px;" alt="">';
											var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
											var fname_youtube = (gyear) ? gfname[0] + " " + gfname[1] : gfname[0] + " " + gfname[2];
											var fname = '<h2 class="swal2-title fnm-title">' + getfname + '</h2>';
											var get_ajax_rel;
											var get_ajax_scr;
											var get_ajax_accid;
											$.ajax({
												url: '/userdetails.php?id=' + getmyacc_id,
												async: false
											}).done(function(myacinfo) {
												get_ajax_accid = myacinfo;
												return get_ajax_accid;
											});
											var obj2 = $(get_ajax_accid);
											var gaccleftdownl_txt = obj2.find(".mn_wrap .mn1_content .tables1.u2 tr:nth-child(6) td:nth-child(2)").text();
											var gaccleftdownl = gaccleftdownl_txt.match(/\d+/g);
											var gaccleftdownl_calc = gaccleftdownl[0] - gaccleftdownl[1];
											if (grel !== null) {
												var grel_id = grel.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + grel_id,
													async: false
												}).done(function(drel) {
													get_ajax_rel = drel;
													return get_ajax_rel;
												});
											} else {
												get_ajax_rel = null;
											}
											if (gscr !== null) {
												var gscr_id = gscr.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + gscr_id,
													async: false
												}).done(function(dscr) {
													get_ajax_scr = dscr;
													return get_ajax_scr;
												});
											} else {
												get_ajax_scr = null;
											}
											var ads_rel = (ssh_rel && get_ajax_rel !== null && get_ajax_rel.match(/без реклам/i) ? '<p style="width: 100%;font-size:16px;text-align:center;padding:0px 0px 10px 0px;color:red;font-weight:bold;">Релиз без рекламы!</p>' : '');
											var similarfiles = (gsimilarfiles !== null ? '<p style="width: 100%;font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;">' + gsimilarfiles + '</p>' : '');
											var menuinfo = (gmenuinfo1 !== null ? '<span class="menuinfo">' + gmenuinfo1 + '</span><br>' : '') + (gmenuinfo2 !== null ? '<span class="menuinfo">' + gmenuinfo2 + '</span><br>' : '') + (gmenuinfo3 !== null ? '<span class="menuinfo">' + gmenuinfo3 + '</span><br>' : '') + (gmenuinfo4 !== null ? '<span class="menuinfo">' + gmenuinfo4 + '</span><br>' : '');
											var trailer = (g_movie ? '<button type="button" class="btnytb swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(fname_youtube + ' трейлер русский') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
											var maininfo = (ssh_mi ? '<b>Техданные:</b><br>' + getinfo : '');
											var aboutfile = (ssh_af ? truncString(gaboutfile, 300, '...') + '<br><br>' : '');
											var rel_info = (ssh_rel && get_ajax_rel !== null ? '<b>Релиз:</b><br>' + get_ajax_rel + '<br><br>' : '');
											var scr_info = (ssh_scr && get_ajax_scr !== null ? '<b>Скриншоты:</b><br>' + get_ajax_scr + '<br><br>' : '');
											if (gaccleftdownl_calc >= 1) {
												Swal.fire({
													width: swal_width,
													html: `
${fname}
<table>
<tr>
<td colspan="2" style="vertical-align:top;padding:10px;font-size: 12px;width:270px;">
${gimg}
${ads_rel}
${similarfiles}
${menuinfo}
<br>
${maininfo}
${trailer}</td>
<td style="vertical-align:top;padding:10px;font-size: 12px;">
${gaboutfile1}<br>
${aboutfile}
${rel_info}
${scr_info}
</td>
</tr>
</table>
${(gaccleftdownl !== null ? '<center><h2 class="swal2-title" style="color:#ff0000;">Вам доступно для скачивания '+declOfNum(gaccleftdownl_calc, ['торрент', 'торрента', 'торрентов'])+'</h2></center>' : '')}`,
													showCancelButton: true,
													confirmButtonColor: '#4fc823',
													cancelButtonColor: '#d33',
													confirmButtonText: SwalConfirmText + " ТОРРЕНТ ФАЙЛ",
													cancelButtonText: SwalCancelText,
													footer: `<center><b style="color:#000099;">Скачивание через торрент</b><br><b style="color:#990000;">Внимание! Этот метод скачивания не актуален для тех, кому важен рейтинг. Так как при скачивании, ваш рейтинг может понизится, тем самым возможен блок аккаунта!</b></center>`
												}).then(function(result) {
													if (result.value) {
														window.location.href = "/download.php?id=" + id;
														Toast.fire({
															icon: 'success',
															title: getfname + ' скачивается через Торрент!'
														});
													}
												});
											} else {
												Swal.fire({
													width: swal_width,
													html: `
${fname}
<table>
<tr>
<td colspan="2" style="vertical-align:top;padding:10px;font-size: 12px;width:270px;">
${gimg}
${ads_rel}
${similarfiles}
${menuinfo}
<br>
${maininfo}
${trailer}</td>
<td style="vertical-align:top;padding:10px;font-size: 12px;">
${gaboutfile1}<br>
${aboutfile}
${rel_info}
${scr_info}
</td>
</tr>
</table>
<center><h2 class="swal2-title" style="color:#ff0000;">Вам доступно для скачивания ${declOfNum(0, ['торрент', 'торрента', 'торрентов'])}</h2></center>
`,
													showCancelButton: true,
													showConfirmButton: false,
													cancelButtonColor: '#d33',
													cancelButtonText: "ПОНЯТНО",
													footer: `<center><b style="color:#000099;">Скачивание через торрент</b><br><b style="color:#990000;">Внимание! Этот метод скачивания не актуален для тех, кому важен рейтинг. Так как при скачивании, ваш рейтинг может понизится, тем самым возможен блок аккаунта!</b></center>`
												});
											}
										});
									} else {
										window.location.href = "/download.php?id=" + id;
										Toast.fire({
											icon: 'success',
											title: getfname + ' скачивается через Торрент!'
										});
									}
								}
							});
						});
						$("#magnet_" + id).click(function() {
							$.ajax({
								url: domain + '/get_srv_details.php?id=' + id + '&action=2'
							}).done(function(s) {
								if (s.toString().indexOf("signup.php") != -1) {
									Toast.fire({
										icon: 'warning',
										html: signup
									});
								} else {
									if (ssh_mgi) {
										$.ajax({
											url: '/details.php?id=' + id
										}).done(function(data) {
											var obj1 = $(data);
											var getinfo = obj1.find('#tabs').html();
											var gsimilarfiles = obj1.find('#tabs2 td.w90p').html();
											var grel = obj1.find(".lis li:contains(Релиз)").html();
											var gscr = obj1.find(".lis li:contains(Скриншоты)").html();
											var gmenuinfo1 = obj1.find(".mn1_menu ul.men li a:contains(Раздают)").html();
											var gmenuinfo2 = obj1.find(".mn1_menu ul.men li a:contains(Скачивают)").html();
											var gmenuinfo3 = obj1.find(".mn1_menu ul.men li a:contains(Скачали)").html();
											var gmenuinfo4 = obj1.find(".mn1_menu ul.men li a:contains(Список файлов)").html();
											var gaboutfile = obj1.find("div.bx1.justify p").html();
											var gaboutfile1 = obj1.find("div.bx1.justify h2").html();
											var g_movie = gaboutfile.indexOf("О фильме:") !== -1;
											var gimg = '<img src="' + (obj1.find("li.img").html().match(/img.*?src=("|')(.*?)\1/i)[2]) + '" style="display: block;width:250px;padding:0px 0px 10px 0px;" alt="">';
											var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
											var fname_youtube = (gyear) ? gfname[0] + " " + gfname[1] : gfname[0] + " " + gfname[2];
											var fname = '<h2 class="swal2-title fnm-title">' + getfname + '</h2>';
											var get_ajax_rel;
											var get_ajax_scr;
											if (grel !== null) {
												var grel_id = grel.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + grel_id,
													async: false
												}).done(function(drel) {
													get_ajax_rel = drel;
													return get_ajax_rel;
												});
											} else {
												get_ajax_rel = null;
											}
											if (gscr !== null) {
												var gscr_id = gscr.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + gscr_id,
													async: false
												}).done(function(dscr) {
													get_ajax_scr = dscr;
													return get_ajax_scr;
												});
											} else {
												get_ajax_scr = null;
											}
											var ads_rel = (ssh_rel && get_ajax_rel !== null && get_ajax_rel.match(/без реклам/i) ? '<p style="width: 100%;font-size:16px;text-align:center;padding:0px 0px 10px 0px;color:red;font-weight:bold;">Релиз без рекламы!</p>' : '');
											var similarfiles = (gsimilarfiles !== null ? '<p style="width: 100%;font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;">' + gsimilarfiles + '</p>' : '');
											var menuinfo = (gmenuinfo1 !== null ? '<span class="menuinfo">' + gmenuinfo1 + '</span><br>' : '') + (gmenuinfo2 !== null ? '<span class="menuinfo">' + gmenuinfo2 + '</span><br>' : '') + (gmenuinfo3 !== null ? '<span class="menuinfo">' + gmenuinfo3 + '</span><br>' : '') + (gmenuinfo4 !== null ? '<span class="menuinfo">' + gmenuinfo4 + '</span><br>' : '');
											var trailer = (g_movie ? '<button type="button" class="btnytb swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(fname_youtube + ' трейлер русский') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
											var maininfo = (ssh_mi ? '<b>Техданные:</b><br>' + getinfo : '');
											var aboutfile = (ssh_af ? truncString(gaboutfile, 300, '...') + '<br><br>' : '');
											var rel_info = (ssh_rel && get_ajax_rel !== null ? '<b>Релиз:</b><br>' + get_ajax_rel + '<br><br>' : '');
											var scr_info = (ssh_scr && get_ajax_scr !== null ? '<b>Скриншоты:</b><br>' + get_ajax_scr + '<br><br>' : '');
											Swal.fire({
												width: swal_width,
												html: `
${fname}
<table>
<tr>
<td colspan="2" style="vertical-align:top;padding:10px;font-size: 12px;width:270px;">
${gimg}
${ads_rel}
${similarfiles}
${menuinfo}
<br>
${maininfo}
${trailer}</td>
<td style="vertical-align:top;padding:10px;font-size: 12px;">
${gaboutfile1}<br>
${aboutfile}
${rel_info}
${scr_info}
</td>
</tr>
</table>`,
												showCancelButton: true,
												showDenyButton: true,
												denyButtonColor: '#237ec8',
												confirmButtonColor: '#4fc823',
												cancelButtonColor: '#d33',
												denyButtonText: "КОПИРОВАТЬ MAGNET",
												confirmButtonText: SwalConfirmText + " ЧЕРЕЗ MAGNET",
												cancelButtonText: SwalCancelText,
												footer: `<center><b style="color:#000099;">Скачивание через MAGNET</b><br><b style="color:#009900;">Ваш рейтинг не упадёт, можете скачивать бесконечно!</b></center>`
											}).then(function(result) {
												var hash = (s.toString().match(mgt_reg))[0];
												if (result.isConfirmed) {
													window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986);
													Toast.fire({
														icon: 'success',
														title: getfname + ' скачивается через Magnet!'
													});
												} else if (result.isDenied) {
													copy("magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986));
													Toast.fire({
														icon: 'success',
														title: 'Magnet ссылка скопирована!'
													});
												}
											});
										});
									} else {
										var hash = (s.toString().match(mgt_reg))[0];
										window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986);
										Toast.fire({
											icon: 'success',
											title: getfname + ' скачивается через Magnet!'
										});
									}
								}
							});
						});
						$("#ace_" + id).click(async function() {
							$.ajax({
								url: domain + '/get_srv_details.php?id=' + id + '&action=2'
							}).done(function(s) {
								if (s.toString().indexOf("signup.php") != -1) {
									Toast.fire({
										icon: 'warning',
										html: signup
									});
								} else {
									if (gfname[0].match(/серии|сезон|(выпуск)|этапы|(логия)/g)) {
										if (gfname[0].match(/(логия)/gi)) {
											var selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
											var selbtn2 = "ОДИН ФИЛЬМ";
										} else if (gfname[0].match(/(выпуск)/gi)) {
											var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
											var selbtn2 = "ОДИН ВЫПУСК";
										} else if (gfname[0].match(/серии|сезон/gi)) {
											var selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
											var selbtn2 = "ОДНА СЕРИЯ";
										} else if (gfname[0].match(/этапы/gi)) {
											var selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
											var selbtn2 = "ОДИН ЭТАП";
										}
										$.ajax({
											url: '/details.php?id=' + id
										}).done(function(data) {
											var obj1 = $(data);
											var getinfo = obj1.find('#tabs').html();
											var gsimilarfiles = obj1.find('#tabs2 td.w90p').html();
											var grel = obj1.find(".lis li:contains(Релиз)").html();
											var gscr = obj1.find(".lis li:contains(Скриншоты)").html();
											var gmenuinfo1 = obj1.find(".mn1_menu ul.men li a:contains(Раздают)").html();
											var gmenuinfo2 = obj1.find(".mn1_menu ul.men li a:contains(Скачивают)").html();
											var gmenuinfo3 = obj1.find(".mn1_menu ul.men li a:contains(Скачали)").html();
											var gmenuinfo4 = obj1.find(".mn1_menu ul.men li a:contains(Список файлов)").html();
											var gaboutfile = obj1.find("div.bx1.justify p").html();
											var gaboutfile1 = obj1.find("div.bx1.justify h2").html();
											var g_movie = gaboutfile.indexOf("О фильме:") !== -1;
											var gimg = '<img src="' + (obj1.find("li.img").html().match(/img.*?src=("|')(.*?)\1/i)[2]) + '" style="display: block;width:250px;padding:0px 0px 10px 0px;" alt="">';
											var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
											var fname_youtube = (gyear) ? gfname[0] + " " + gfname[1] : gfname[0] + " " + gfname[2];
											var fname = '<h2 class="swal2-title fnm-title">' + getfname + '</h2>';
											var get_ajax_rel;
											var get_ajax_scr;
											if (grel !== null) {
												var grel_id = grel.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + grel_id,
													async: false
												}).done(function(drel) {
													get_ajax_rel = drel;
													return get_ajax_rel;
												});
											} else {
												get_ajax_rel = null;
											}
											if (gscr !== null) {
												var gscr_id = gscr.match(/\d+/g)[1];
												$.ajax({
													url: '/get_srv_details.php?id=' + id + '&pagesd=' + gscr_id,
													async: false
												}).done(function(dscr) {
													get_ajax_scr = dscr;
													return get_ajax_scr;
												});
											} else {
												get_ajax_scr = null;
											}
											var ads_rel = (ssh_rel && get_ajax_rel !== null && get_ajax_rel.match(/без реклам/i) ? '<p style="width: 100%;font-size:16px;text-align:center;padding:0px 0px 10px 0px;color:red;font-weight:bold;">Релиз без рекламы!</p>' : '');
											var similarfiles = (gsimilarfiles !== null ? '<p style="width: 100%;font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;">' + gsimilarfiles + '</p>' : '');
											var menuinfo = (gmenuinfo1 !== null ? '<span class="menuinfo">' + gmenuinfo1 + '</span><br>' : '') + (gmenuinfo2 !== null ? '<span class="menuinfo">' + gmenuinfo2 + '</span><br>' : '') + (gmenuinfo3 !== null ? '<span class="menuinfo">' + gmenuinfo3 + '</span><br>' : '') + (gmenuinfo4 !== null ? '<span class="menuinfo">' + gmenuinfo4 + '</span><br>' : '');
											var trailer = (g_movie ? '<button type="button" class="btnytb swal2-styled" onclick="window.open(\'https://www.youtube.com/results?search_query=' + encodeURIComponent(fname_youtube + ' трейлер русский') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
											var maininfo = (ssh_mi ? '<b>Техданные:</b><br>' + getinfo : '');
											var aboutfile = (ssh_af ? truncString(gaboutfile, 300, '...') + '<br><br>' : '');
											var rel_info = (ssh_rel && get_ajax_rel !== null ? '<b>Релиз:</b><br>' + get_ajax_rel + '<br><br>' : '');
											var scr_info = (ssh_scr && get_ajax_scr !== null ? '<b>Скриншоты:</b><br>' + get_ajax_scr + '<br><br>' : '');
											Swal.fire({
												width: swal_width,
												html: `
${fname}
<table>
<tr>
<td colspan="2" style="vertical-align:top;padding:10px;font-size: 12px;width:270px;">
${gimg}
${ads_rel}
${similarfiles}
${menuinfo}
<br>
${maininfo}
${trailer}</td>
<td style="vertical-align:top;padding:10px;font-size: 12px;">
${gaboutfile1}<br>
${aboutfile}
${rel_info}
${scr_info}
</td>
</tr>
</table>
<center>
<button type="button" id="1" class="btnconfirm swal2-styled">${selbtn1}</button>
<button type="button" id="2" class="btnconfirm swal2-styled">${selbtn2}</button>
<button type="button" id="cancel" class="btncnc">ОТМЕНА</button>
</center>`,
												showCancelButton: false,
												showConfirmButton: false,
												footer: `<center><b style="color:#000099;">Копирование для просмотра через AceStream</b><br><b style="color:#009900;">Ваш рейтинг не упадёт, можете скачивать бесконечно!</b></center>`
											});
											$("#1").on("click", async function(e) {
												const {
													value: formValues
												} = await Swal.fire({
													title: getfname,
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
														});
													},
													showCloseButton: false,
													showCancelButton: false,
													showConfirmButton: true,
													confirmButtonColor: '#3085d6',
													confirmButtonText: 'Копировать'
												});
												if (formValues) {
													var year1 = gfname[1].replace(/(.*)/gi, "$1");
													var year2 = gfname[2].replace(/(.*)/gi, "$1");
													var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
													if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
														var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
													} else {
														var search_gfname = getfname;
													}
													var fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
													$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
														if (s.toString().indexOf("signup.php") != -1) {
															Toast.fire({
																icon: 'warning',
																html: signup
															});
														} else {
															if (gfname[0].match(/(логия)/gi)) {
																var number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
															} else if (gfname[0].match(/(выпуск)/gi)) {
																var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
															} else if (gfname[0].match(/серии|сезон/gi)) {
																var number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
															} else if (gfname[0].match(/этапы/gi)) {
																var number_copy = declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
															}
															var hash = (s.toString().match(mgt_reg))[0];
															var copy_text = "";
															var i = 0;
															while (i < formValues) {
																var set_i = 1 + i;
																if (gfname[0].match(/(логия)/gi)) {
																	var copyname = fname + " / " + set_i + "-й ФИЛЬМ";
																} else if (gfname[0].match(/(выпуск)/gi)) {
																	var copyname = fname + " / " + set_i + " ВЫПУСК";
																} else if (gfname[0].match(/серии|сезон/gi)) {
																	var copyname = fname + " / " + set_i + " СЕРИЯ";
																} else if (gfname[0].match(/этапы/gi)) {
																	var copyname = fname + " / " + set_i + " ЭТАП";
																}
																copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
																i++;
															}
															copy(copy_text);
															Toast.fire({
																icon: 'success',
																title: 'СКОПИРОВАНО ' + number_copy + ' !'
															});
														}
													});
												}
											});
											$("#2").on("click", async function(e) {
												const {
													value: formValues
												} = await Swal.fire({
													title: getfname,
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
														});
													},
													showCloseButton: false,
													showCancelButton: false,
													showConfirmButton: true,
													confirmButtonColor: '#3085d6',
													confirmButtonText: 'Копировать'
												});
												if (formValues) {
													var year1 = gfname[1].replace(/(.*)/gi, "$1");
													var year2 = gfname[2].replace(/(.*)/gi, "$1");
													var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
													if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
														var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
													} else {
														var search_gfname = getfname;
													}
													fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
													$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
														if (s.toString().indexOf("signup.php") != -1) {
															Toast.fire({
																icon: 'warning',
																html: signup
															});
														} else {
															var hash = (s.toString().match(mgt_reg))[0];
															var set_i = formValues - 1;
															if (gfname[0].match(/(логия)/gi)) {
																var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
															} else if (gfname[0].match(/(выпуск)/gi)) {
																var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
															} else if (gfname[0].match(/серии|сезон/gi)) {
																var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
															} else if (gfname[0].match(/этапы/gi)) {
																var number_copy = formValues + " ЭТАП СКОПИРОВАН !";
															}
															if (gfname[0].match(/(логия)/gi)) {
																var copyname = fname + " / " + formValues + "-й ФИЛЬМ";
															} else if (gfname[0].match(/(выпуск)/gi)) {
																var copyname = fname + " / " + formValues + " ВЫПУСК";
															} else if (gfname[0].match(/серии|сезон/gi)) {
																var copyname = fname + " / " + formValues + " СЕРИЯ";
															} else if (gfname[0].match(/этапы/gi)) {
																var copyname = fname + " / " + formValues + " ЭТАП";
															}
															copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
															Toast.fire({
																icon: 'success',
																title: number_copy
															});
														}
													});
												}
											});
											$("#cancel").on("click", function(e) {
												Swal.close();
											});
										});
									} else {
										var year1 = gfname[1].replace(/(.*)/gi, "$1");
										var year2 = gfname[2].replace(/(.*)/gi, "$1");
										var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
										var getfname = gfname[0].toUpperCase();
										var fname = (gyear) ? getfname + " / " + year1 : getfname + " / " + year2;
										Toast.fire({
											icon: 'success',
											title: 'Раздача ( ' + getfname + ' ) скопирована!'
										});
										var hash = (s.toString().match(mgt_reg))[0];
										copy("\r\n#EXTINF:-1," + fname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
									}
								}
							});
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
	if (reg_kinozal_detailed.test(get_url)) {
		function KinozalDetailSettingsScript() {
			this.settings = {};
			this.loadSettings = function() {
				if (GM_getValue("ShowTorrentButtonD") == undefined) {
					GM_setValue("ShowTorrentButtonD", false);
				}
				if (GM_getValue("ConfirmDownloadTorrentD") == undefined) {
					GM_setValue("ConfirmDownloadTorrentD", true);
				}
				if (GM_getValue("ShowMagnetButtonD") == undefined) {
					GM_setValue("ShowMagnetButtonD", true);
				}
				if (GM_getValue("ConfirmDownloadMagnetD") == undefined) {
					GM_setValue("ConfirmDownloadMagnetD", true);
				}
				if (GM_getValue("ShowAcestreamButtonD") == undefined) {
					GM_setValue("ShowAcestreamButtonD", false);
				}
				if (GM_getValue("ShowHelpButtonD") == undefined) {
					GM_setValue("ShowHelpButtonD", false);
				}
				if (GM_getValue("DetailedInfoButtonsD") == undefined) {
					GM_setValue("DetailedInfoButtonsD", false);
				}
				this.settings = {
					ShowTorrentButtonD: GM_getValue('ShowTorrentButtonD', false),
					ConfirmDownloadTorrentD: GM_getValue('ConfirmDownloadTorrentD', true),
					ShowMagnetButtonD: GM_getValue('ShowMagnetButtonD', true),
					ConfirmDownloadMagnetD: GM_getValue('ConfirmDownloadMagnetD', true),
					ShowAcestreamButtonD: GM_getValue('ShowAcestreamButtonD', false),
					ShowHelpButtonD: GM_getValue('ShowHelpButtonD', true),
					DetailedInfoButtonsD: GM_getValue('DetailedInfoButtonsD', true)
				};
			}
			this.toggleSettings = function() {
				var $sett_wnd = $('#acemgn_script_settings'),
					x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
					y = parseInt(($(window).height() - $sett_wnd.height()) / 2);
				if (this.settings.ShowTorrentButtonD) {
					$('#ShowTorrentButtonD').attr('checked', true);
				}
				if (this.settings.ShowMagnetButtonD) {
					$('#ShowMagnetButtonD').attr('checked', true);
				}
				if (this.settings.ShowAcestreamButtonD) {
					$('#ShowAcestreamButtonD').attr('checked', true);
				}
				if (this.settings.ConfirmDownloadTorrentD) {
					$('#ConfirmDownloadTorrentD').attr('checked', true);
				}
				if (this.settings.ConfirmDownloadMagnetD) {
					$('#ConfirmDownloadMagnetD').attr('checked', true);
				}
				if (this.settings.ShowHelpButtonD) {
					$('#ShowHelpButtonD').attr('checked', true);
				}
				if (this.settings.DetailedInfoButtonsD) {
					$('#DetailedInfoButtonsD').attr('checked', true);
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
			<div class="title">Торрент кнопка</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowTorrentButtonD"></div>
		</div>
		<div class="row">
			<div class="col1">Включить подтверждение?</div>
			<div class="col2"><input type="checkbox" id="ConfirmDownloadTorrentD"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Магнит кнопка</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowMagnetButtonD"></div>
		</div>
		<div class="row">
			<div class="col1">Включить подтверждение?</div>
			<div class="col2"><input type="checkbox" id="ConfirmDownloadMagnetD"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Acestream кнопка</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowAcestreamButtonD"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Остальное</div>
			<div class="col1">Показать кнопку "Помощь" ?</div>
			<div class="col2"><input type="checkbox" id="ShowHelpButtonD"></div>
		</div>
		<div class="row">
			<div class="col1">Сделать простыми кнопки скачивания?</div>
			<div class="col2"><input type="checkbox" id="DetailedInfoButtonsD"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="btnconfirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
				$('body').append($wnd);
				$('#acemgn_script_save_settings').live('click', function() {
					GM_setValue('ShowTorrentButtonD', $('#ShowTorrentButtonD').is(':checked'));
					GM_setValue('ConfirmDownloadTorrentD', $('#ConfirmDownloadTorrentD').is(':checked'));
					GM_setValue('ShowMagnetButtonD', $('#ShowMagnetButtonD').is(':checked'));
					GM_setValue('ConfirmDownloadMagnetD', $('#ConfirmDownloadMagnetD').is(':checked'));
					GM_setValue('ShowAcestreamButtonD', $('#ShowAcestreamButtonD').is(':checked'));
					GM_setValue('ShowHelpButtonD', $('#ShowHelpButtonD').is(':checked'));
					GM_setValue('DetailedInfoButtonsD', $('#DetailedInfoButtonsD').is(':checked'));
					obj.loadSettings();
					$('#acemgn_script_settings').toggle('fast');
					location.reload();
				});
			}
			this.Kinozal_MainScript = function() {
				var obj = this;
				var reg_id = new RegExp('id=[0-9]{6,10}', 'ig');
				var id = (get_url.match(reg_id)[0]).substr(3);
				var domain = get_url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:[^.]+\.)?([^:\/\n\?\=]+)/im)[0];
				var mgt_reg = new RegExp('[a-zA-Z0-9]{40}', 'i');
				var gfname = $('.mn_wrap div h1 a').text().split(" / ");
				var getfname = gfname[0].toUpperCase();
				var SwalConfirmText = "СКАЧАТЬ";
				var SwalCancelText = "ОТМЕНА";
				var signup = "Чтобы скачать, нужно зайти на сайт!";
				var txt_dl_torrent_info = '<b><font color="#cc0000">Cкачать торрент-файл:</font></b><br>Для того, чтобы скачать эту раздачу - скачайте торрент-файл и запустите его при помощи клиента.';
				var txt_dl_magnet_info = '<b><font color="#0000cc">Cкачать через Magnet:</font></b><br>Скачивайте сколько угодно, ваш рейтинг не изменится, так как данный метод не затрагивает ваш профиль!';
				var txt_cp_acestream_info = '<b><font color="#00cc00">Смотреть через ACESTREAM:</font></b><br>Смотрите через Acestream ( На Android TV, в Планшете, в Телефоне )';
				if (obj.settings.ShowTorrentButtonD || obj.settings.ShowMagnetButtonD || obj.settings.ShowAcestreamButtonD) {
					if (obj.settings.DetailedInfoButtonsD) {
						var set_buttons = document.querySelector("table.w100p");
						set_buttons.classList.add('bx1');
						set_buttons.innerHTML = `<tbody id="copy_form">
	<tr>
		<td class="nw">
		${obj.settings.ShowTorrentButtonD ? ' <button id="TorrentButton" type="button" class="btndt">TORRENT</button>' : ''}
		${obj.settings.ShowMagnetButtonD ? ' <button id="MagnetButton" type="button" class="btndm">MAGNET</button>' : ''}
		${obj.settings.ShowAcestreamButtonD ? ' <button id="AceStreamButton" type="button" class="btnace">ACESTREAM</button>' : ''}
		</td>
	</tr>
${obj.settings.ShowHelpButtonD ? ' <tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : ''}
</tbody>`;
					} else {
						var set_buttons = document.querySelector("table.w100p");
						set_buttons.classList.add('bx1');
						set_buttons.innerHTML = `<tbody id="copy_form">
	${obj.settings.ShowTorrentButtonD ? '<tr><td style="width: 400px;" class="nw"><button id="TorrentButton" type="button" class="btndt">Cкачать торрент-файл</button></td><td>' + txt_dl_torrent_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowMagnetButtonD ? '<tr><td style="width: 400px;" class="nw"><button id="MagnetButton" type="button" class="btndm">Cкачать через Magnet</button></td><td>' + txt_dl_magnet_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowAcestreamButtonD ? '<tr><td style="width: 400px;" class="nw"><button id="AceStreamButton" type="button" class="btnace">ACESTREAM</button></td><td>' + txt_cp_acestream_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : ''}
	${obj.settings.ShowHelpButtonD ? '<tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : ''}
</tbody>`;
					}
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
						});
					} else if (target.id === 'AceStreamButton') {
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") != -1) {
								Toast.fire({
									icon: 'warning',
									html: signup
								});
							} else {
								if (gfname[0].match(/серии|сезон|(выпуск)|этапы|(логия)/g)) {
									if (gfname[0].match(/(логия)/gi)) {
										var selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
										var selbtn2 = "ОДИН ФИЛЬМ";
									} else if (gfname[0].match(/(выпуск)/gi)) {
										var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
										var selbtn2 = "ОДИН ВЫПУСК";
									} else if (gfname[0].match(/серии|сезон/gi)) {
										var selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
										var selbtn2 = "ОДНА СЕРИЯ";
									} else if (gfname[0].match(/этапы/gi)) {
										var selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
										var selbtn2 = "ОДИН ЭТАП";
									}
									Swal.fire({
										title: getfname,
										html: `Копировать для просмотра через AceStream<br>
<button type="button" id="1" class="btnconfirm swal2-styled">${selbtn1}</button>
<button type="button" id="2" class="btnconfirm swal2-styled">${selbtn2}</button><br>
<button type="button" id="cancel" class="btncnc swal2-styled">ОТМЕНА</button>`,
										showCancelButton: false,
										showConfirmButton: false
									});
									$("#1").on("click", async function(e) {
										const {
											value: formValues
										} = await Swal.fire({
											title: getfname,
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
												});
											},
											showCloseButton: false,
											showCancelButton: false,
											showConfirmButton: true,
											confirmButtonColor: '#3085d6',
											confirmButtonText: 'Копировать'
										});
										if (formValues) {
											var year1 = gfname[1].replace(/(.*)/gi, "$1");
											var year2 = gfname[2].replace(/(.*)/gi, "$1");
											var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
											if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
												var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
											} else {
												var search_gfname = getfname;
											}
											var fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
											$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
												if (s.toString().indexOf("signup.php") != -1) {
													Toast.fire({
														icon: 'warning',
														html: signup
													});
												} else {
													if (gfname[0].match(/(логия)/gi)) {
														var number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
													} else if (gfname[0].match(/(выпуск)/gi)) {
														var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
													} else if (gfname[0].match(/серии|сезон/gi)) {
														var number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
													} else if (gfname[0].match(/этапы/gi)) {
														var number_copy = declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
													}
													var hash = (s.toString().match(mgt_reg))[0];
													var copy_text = "";
													var i = 0;
													while (i < formValues) {
														var set_i = 1 + i;
														if (gfname[0].match(/(логия)/gi)) {
															var copyname = fname + " / " + set_i + "-й ФИЛЬМ";
														} else if (gfname[0].match(/(выпуск)/gi)) {
															var copyname = fname + " / " + set_i + " ВЫПУСК";
														} else if (gfname[0].match(/серии|сезон/gi)) {
															var copyname = fname + " / " + set_i + " СЕРИЯ";
														} else if (gfname[0].match(/этапы/gi)) {
															var copyname = fname + " / " + set_i + " ЭТАП";
														}
														copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
														i++;
													}
													copy(copy_text);
													Toast.fire({
														icon: 'success',
														title: 'СКОПИРОВАНО ' + number_copy + ' !'
													});
												}
											});
										}
									});
									$("#2").on("click", async function(e) {
										const {
											value: formValues
										} = await Swal.fire({
											title: getfname,
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
												});
											},
											showCloseButton: false,
											showCancelButton: false,
											showConfirmButton: true,
											confirmButtonColor: '#3085d6',
											confirmButtonText: 'Копировать'
										});
										if (formValues) {
											var year1 = gfname[1].replace(/(.*)/gi, "$1");
											var year2 = gfname[2].replace(/(.*)/gi, "$1");
											var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
											if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi)) {
												var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
											} else {
												var search_gfname = getfname;
											}
											fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
											$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
												if (s.toString().indexOf("signup.php") != -1) {
													Toast.fire({
														icon: 'warning',
														html: signup
													});
												} else {
													var hash = (s.toString().match(mgt_reg))[0];
													var set_i = formValues - 1;
													if (gfname[0].match(/(логия)/gi)) {
														var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
													} else if (gfname[0].match(/(выпуск)/gi)) {
														var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
													} else if (gfname[0].match(/серии|сезон/gi)) {
														var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
													} else if (gfname[0].match(/этапы/gi)) {
														var number_copy = formValues + " ЭТАП СКОПИРОВАН !";
													}
													if (gfname[0].match(/(логия)/gi)) {
														var copyname = fname + " / " + formValues + "-й ФИЛЬМ";
													} else if (gfname[0].match(/(выпуск)/gi)) {
														var copyname = fname + " / " + formValues + " ВЫПУСК";
													} else if (gfname[0].match(/серии|сезон/gi)) {
														var copyname = fname + " / " + formValues + " СЕРИЯ";
													} else if (gfname[0].match(/этапы/gi)) {
														var copyname = fname + " / " + formValues + " ЭТАП";
													}
													copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
													Toast.fire({
														icon: 'success',
														title: number_copy
													});
												}
											});
										}
									});
									$("#cancel").on("click", function(e) {
										Swal.close();
									});
								} else {
									var year1 = gfname[1].replace(/(.*)/gi, "$1");
									var year2 = gfname[2].replace(/(.*)/gi, "$1");
									var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
									var fname = (gyear) ? getfname + " / " + year1 : getfname + " / " + year2;
									Toast.fire({
										icon: 'success',
										title: 'Раздача ( ' + getfname + ' ) скопирована!'
									});
									var hash = (s.toString().match(mgt_reg))[0];
									copy("\r\n#EXTINF:-1," + fname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
								}
							}
						});
					} else if (target.id === 'MagnetButton') {
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") != -1) {
								Toast.fire({
									icon: 'warning',
									html: signup
								});
							} else {
								if (obj.settings.ConfirmDownloadMagnetD) {
									Swal.fire({
										title: getfname,
										showCancelButton: true,
										showDenyButton: true,
										denyButtonColor: '#237ec8',
										confirmButtonColor: '#4fc823',
										cancelButtonColor: '#d33',
										denyButtonText: "КОПИРОВАТЬ",
										confirmButtonText: SwalConfirmText,
										cancelButtonText: SwalCancelText,
										footer: `<center><b style="color:#000099;">Скачивание через MAGNET</b><br><b style="color:#009900;">Ваш рейтинг не упадёт, можете скачивать бесконечно!</b></center>`
									}).then(function(result) {
										var hash = (s.toString().match(mgt_reg))[0];
										if (result.isConfirmed) {
											window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986);
											Toast.fire({
												icon: 'success',
												title: getfname + ' скачивается через Magnet!'
											});
										} else if (result.isDenied) {
											copy("magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986));
											Toast.fire({
												icon: 'success',
												title: 'Magnet ссылка скопирована!'
											});
										}
									});
								} else {
									var hash = (s.toString().match(mgt_reg))[0];
									window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + encodeURIComponent(getfname)).substring(0, 1986);
									Toast.fire({
										icon: 'success',
										title: getfname + ' скачивается через Magnet!'
									});
								}
							}
						});
					} else if (target.id === 'TorrentButton') {
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s) {
							if (s.toString().indexOf("signup.php") != -1) {
								Toast.fire({
									icon: 'warning',
									html: signup
								});
							} else {
								if (obj.settings.ConfirmDownloadTorrentD) {
									Swal.fire({
										title: "Скачать Торрент файл?",
										html: "Раздача:<br><b>" + getfname + "</b><br><br>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!",
										icon: 'question',
										showCancelButton: true,
										confirmButtonColor: '#4fc823',
										cancelButtonColor: '#d33',
										confirmButtonText: SwalConfirmText,
										cancelButtonText: SwalCancelText
									}).then(function(result) {
										if (result.value) {
											window.location.href = "/download.php?id=" + id;
											Toast.fire({
												icon: 'success',
												title: getfname + ' скачивается через Торрент!'
											});
										}
									});
								} else {
									window.location.href = "/download.php?id=" + id;
									Toast.fire({
										icon: 'success',
										title: getfname + ' скачивается через Торрент!'
									});
								}
							}
						});
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
				if (document.getElementById('TorrentButton') != null) {
					document.getElementById("TorrentButton").click();
				}
			} else if (event.code == 'Digit2' && (event.shiftKey || event.metaKey)) {
				if (document.getElementById('MagnetButton') != null) {
					document.getElementById("MagnetButton").click();
				}
			} else if (event.code == 'Digit3' && (event.shiftKey || event.metaKey)) {
				if (document.getElementById('AceStreamButton') != null) {
					document.getElementById("AceStreamButton").click();
				}
			}
		});
		(new KinozalDetailSettingsScript()).init();
	}
	if (reg_rutor.test(get_url)) {
		function RutorScriptSettingsScript() {
			this.settings = {};
			this.loadSettings = function() {
				if (GM_getValue("ShowMagnetButtonR") == undefined) {
					GM_setValue("ShowMagnetButtonR", true);
				}
				if (GM_getValue("ShowAcestreamButtonR") == undefined) {
					GM_setValue("ShowAcestreamButtonR", true);
				}
				this.settings = {
					ShowMagnetButtonR: GM_getValue('ShowMagnetButtonR', true),
					ShowAcestreamButtonR: GM_getValue('ShowAcestreamButtonR', true)
				};
			}
			this.toggleSettings = function() {
				var $sett_wnd = $('#acemgn_script_settings'),
					x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
					y = parseInt(($(window).height() - $sett_wnd.height()) / 2);
				if (this.settings.ShowMagnetButtonR) {
					$('#ShowMagnetButtonR').attr('checked', true);
				}
				if (this.settings.ShowAcestreamButtonR) {
					$('#ShowAcestreamButtonR').attr('checked', true);
				}
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
		<h3>Кнопки скачивания</h3>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Магнит настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowMagnetButtonR"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row">
			<div class="title">Acestream настройки</div>
			<div class="col1">Включить кнопку ?</div>
			<div class="col2"><input type="checkbox" id="ShowAcestreamButtonR"></div>
		</div>
	</div>
	<div class="fields">
		<div class="row" style="text-align: center">
			<input type="button" class="btnconfirm swal2-styled" value="Сохранить настройки" id="acemgn_script_save_settings" />
		</div>
	</div>
</div>`);
				$('body').append($wnd);
				$('#acemgn_script_save_settings').live('click', function() {
					GM_setValue('ShowMagnetButtonR', $('#ShowMagnetButtonR').is(':checked'));
					GM_setValue('ShowAcestreamButtonR', $('#ShowAcestreamButtonR').is(':checked'));
					obj.loadSettings();
					$('#acemgn_script_settings').toggle('fast');
					location.reload();
				});
			}
			this.RutorScript = function() {
				var obj = this;
				var hash = document.getElementById('download').getElementsByTagName('a')[0].getAttribute("href").match(/magnet:\?xt=urn:btih:([a-z\d]{40})&/im)[1];
				var set_buttons = document.querySelector("#download");
				var fname = $('div#all > H1').text();
				set_buttons.innerHTML += `<br><table id="copy_form">
				<tbody>
	<tr>
		<td class="nw">
		${obj.settings.ShowMagnetButtonR ? ' <button id="MagnetButton" type="button" class="btndm">MAGNET</button>' : ''}
		${obj.settings.ShowAcestreamButtonR ? ' <button id="AceStreamButton" type="button" class="btnace">ACESTREAM</button>' : ''}
		</td>
	</tr>
	<tr>
		<td colspan="2"><b style="color:#cc0000">Скрипт предназначен для копирования ссылок LIBTORRENT и ACESTREAM.<br>Скопированные ссылки вкидывайте в свой <font style="color:#00cc00">m3u8</font> плейлист</b></td>
	</tr>
</tbody>
</table>`;
				document.getElementById('copy_form').addEventListener('click', async function(evt) {
					var target = evt.target;
					if (target.id === 'AceStreamButtonR') {
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
								title: fname,
								html: `Копировать для просмотра через AceStream<br>
<button type="button" id="1" class="btnconfirm swal2-styled">${selbtn1}</button>
<button type="button" id="2" class="btnconfirm swal2-styled">${selbtn2}</button><br>
<button type="button" id="cancel" class="btncnc swal2-styled">ОТМЕНА</button>`,
								showCancelButton: false,
								showConfirmButton: false
							});
							$("#1").on("click", async function(e) {
								const {
									value: formValues
								} = await Swal.fire({
									title: fname,
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
										});
									},
									showCloseButton: false,
									showCancelButton: false,
									showConfirmButton: true,
									confirmButtonColor: '#3085d6',
									confirmButtonText: 'Копировать'
								});
								if (formValues) {
									if (get_cat.match(/(логия)/gi)) {
										var number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
									} else if (get_cat.match(/(выпуск)/gi)) {
										var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
									} else if (get_cat.match(/серии|сезон/gi)) {
										var number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
									} else if (get_cat.match(/этапы/gi)) {
										var number_copy = declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
									} else {
										var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
									}
									var copy_text = "";
									var i = 0;
									while (i < formValues) {
										var set_i = 1 + i;
										if (get_cat.match(/(логия)/gi)) {
											var copyname = fname + " / " + set_i + "-й ФИЛЬМ";
										} else if (get_cat.match(/(выпуск)/gi)) {
											var copyname = fname + " / " + set_i + " ВЫПУСК";
										} else if (get_cat.match(/серии|сезон/gi)) {
											var copyname = fname + " / " + set_i + " СЕРИЯ";
										} else if (get_cat.match(/этапы/gi)) {
											var copyname = fname + " / " + set_i + " ЭТАП";
										} else {
											var copyname = fname + " / " + set_i + " ВЫПУСК";
										}
										copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
										i++;
									}
									copy(copy_text);
									Toast.fire({
										icon: 'success',
										title: 'СКОПИРОВАНО ' + number_copy + ' !'
									});
								}
							});
							$("#2").on("click", async function(e) {
								const {
									value: formValues
								} = await Swal.fire({
									title: fname,
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
										});
									},
									showCloseButton: false,
									showCancelButton: false,
									showConfirmButton: true,
									confirmButtonColor: '#3085d6',
									confirmButtonText: 'Копировать'
								});
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
										var copyname = fname + " / " + formValues + "-й ФИЛЬМ";
									} else if (get_cat.match(/(выпуск)/gi)) {
										var copyname = fname + " / " + formValues + " ВЫПУСК";
									} else if (get_cat.match(/серии|сезон/gi)) {
										var copyname = fname + " / " + formValues + " СЕРИЯ";
									} else if (get_cat.match(/этапы/gi)) {
										var copyname = fname + " / " + formValues + " ЭТАП";
									} else {
										var copyname = fname + " / " + formValues + " ВЫПУСК";
									}
									copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
									Toast.fire({
										icon: 'success',
										title: number_copy
									});
								}
							});
							$("#cancel").on("click", function(e) {
								Swal.close();
							});
						} else {
							Toast.fire({
								icon: 'success',
								title: 'Раздача ( ' + fname + ' ) скопирована!'
							});
							copy("\r\n#EXTINF:-1," + fname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
						}
					} else if (target.id === 'MagnetButton') {
						window.location.href = "magnet:?xt=urn:btih:" + hash.toUpperCase() + ('&dn=' + encodeURIComponent(fname)).substring(0, 1986);
						Toast.fire({
							icon: 'success',
							title: 'Раздача ( ' + fname + ' ) скачивается через Magnet!'
						});
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
})();
