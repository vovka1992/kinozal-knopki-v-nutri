// ==UserScript==
// @name Kinozal+Rutor | Кнопки скачивания (Torrent/Magnet/Acestream)
// @description Torrent - Всего лишь заменяет старую кнопку на новую / Magnet - Скачать без учёта рейтинга/скачивания / AceStream - Смотреть через AceStream ( Актуально для Android TV/Планшета/Телефона ) / Настройки - Настраивайте под себя, какие кнопки показывать, а какие убрать, выделение раздачи ( 4K 2160p 1080p ).
// @namespace none
// @version 1.1.9
// @author https://greasyfork.org/ru/users/173690
// @author https://greasyfork.org/scripts/39242
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAD1BMVEU7R4CAAAD4+/z9787///8A0Su5AAAASUlEQVR4AXWPAQrEMBACzen/33wdkGILFZQdSFxWkZKoyWBsd5JXvFgMfC6ZLBs0pq8Mtq8f0Bcbw9N3HvuI8i14sAt/e8/73j/4FwHuDyR5AQAAAABJRU5ErkJggg==
// @include /^(https?:\/\/)?(www\.)?kinozal(\.me|\.tv|\.guru|\.website|tv\.life)\/*/
// @include /^(https?:\/\/)?(www\.)?rutor\.(info|is)\/*/
// @include /^(https?:\/\/)?(www\.)?kinopoisk\.ru\/*/
// @require https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.all.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
/* globals $ */
// ==/UserScript==
(function()
{
	'use strict';
	var script_version = " v1.1.9";
	GM_addStyle(`
@import "https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.min.css";
@import "https://cdn.jsdelivr.net/npm/microtip@0.2.2/microtip.css";
@import "https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css";
@font-face{font-family: "Open Sans";font-style: normal;font-weight: 400;src: local("Open Sans"), local(OpenSans), url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}
.fa{font-family: FontAwesome;}

.checkboxToggle b {cursor: pointer;position: relative;display: inline-block;width: 70px;height: 33px;background: #f2f2f2;border: 1px solid #d0d0d0;border-radius: 23px;vertical-align: text-bottom;transition: all 0.2s linear;}
.checkboxToggle b::after {content: "";position: absolute;left: 0;width: 29px;height: 29px;background-color: #fff;border-radius: 30px;box-shadow: 0px 0px 2px rgb(0 0 0 / 50%);transform: translate3d(2px, 2px, 0);transition: all 0.2s ease-in-out;}
.checkboxToggle:active b::after {width: 35px;transform: translate3d(2px, 2px, 0);}
.checkboxToggle:active input:checked + b::after {transform: translate3d(33px, 2px, 0); }
.checkboxToggle input {display: none;}
.checkboxToggle input:checked + b { background-color: #4bd763;border-color: #3aa24c}
.checkboxToggle input:checked + b::after {transform: translate3d(39px, 2px, 0);}

.ScriptSettingsContainer tbody>tr:hover td:nth-child(1) {background-color: #f5f5f58c;border-radius: 10px 0px 0px 10px;border-top-color: #d0d0d0;border-top-style: solid;border-top-width: 1px;border-right-color: #f5f5f58c;border-bottom-color: #d0d0d0;border-bottom-style: solid;border-bottom-width: 1px;border-left-color: #d0d0d0;border-left-style: solid;border-left-width: 1px;}
.ScriptSettingsContainer tbody>tr:hover td:nth-child(2) {background-color: #f5f5f58c;border-radius: 0px 10px 10px 0px;border-top-color: #d0d0d0;border-top-style: solid;border-top-width: 1px;border-right-color: #d0d0d0;border-right-style: solid;border-right-width: 1px;border-bottom-color: #d0d0d0;border-bottom-style: solid;border-bottom-width: 1px;border-left-color: #f5f5f58c;}
.ScriptSettingsContainer tbody>tr td:nth-child(1){border: 1px solid #ffffff;}
.ScriptSettingsContainer tbody>tr td:nth-child(2){border: 1px solid #ffffff;}

.t_peer td.swalbtn{width:45px;text-align:center}
.swal2-styled.swal2-cancel,.swal2-styled.swal2-confirm,.swal2-styled.swal2-deny,.swal2-styled.swal2-deny{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}
.swal2-content{font-style: normal;text-align: left;color: #000;padding: 0px;}

.menuinfo .floatright{float:right;color:#f00}
.menuinfo{font-weight:bold}
.fnm-title{margin: auto;font-weight:bold;font-family:Open Sans;text-transform:uppercase;font-size:35px;margin: 0px 0px 10px 0px;color:rgb(221 60 60);text-shadow:1px 1px 1px rgb(92 0 0), 2px 2px 1px rgb(92 0 0);}
.fnm-ads-title{font-weight: bold;font-family: Open Sans;text-transform: uppercase;font-size: 28px;text-align: center;padding: 0px 0px 4px 0px;}
.fnm-no-ads{color: rgb(0 153 0);text-shadow: 1px 1px 1px rgb(0 78 0);}
.fnm-with-ads{color: rgb(255 0 0);text-shadow: 1px 1px 1px rgb(78 0 0);}

.swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 14px;display: block;padding: 12px 10px;}
.swal-settings-label p {font-size: 11px;}
.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}
.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 16px;padding: 6px;margin: 6px;border-radius: 5px;width: 240px;}
.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 6px;border-radius: 5px;width: 30px;height: 30px;}
.swal-settings-buttons{text-align: center;}
.swal-settings-title {padding: 4px 0px;font-size: 16px;font-weight: bold;text-align: center;}
.swal-settings-title p {font-size: 11px;font-weight: bold;}
.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}

.main_button_search {font-family: FontAwesome;margin: 0px 4px 0px 4px;cursor: pointer;outline: 0;padding: 6px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;line-height: 0;font-size: 30px;border-radius: .25rem;color: #fff;background-color: #2778c4;border: 0;width: 44px;}
.main_button_search:hover{color:#fff;background-color:#236cb0}
.main_button_search:focus,.main_button_search:active{color:#fff;background-color:#1f609d}

.btn_small{transition: border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:18px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}
.btn_normal{transition: border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:24px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}
.btn_big{transition: border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:bold;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:30px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}

.btn_cred{color:#fff;background-color:#d92638}
.btn_cred:hover{color:#fff;background-color:#c32232;box-shadow:0 0 0 .1rem rgba(225,83,97,0.5);}
.btn_cred:focus,.btn_cred:active{color:#fff;background-color:#ad1f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,0.5);}

.btn_cblue{color:#fff;background-color:#2778c4}
.btn_cblue:hover{color:#fff;background-color:#236cb0;box-shadow:0 0 0 .1rem rgba(35, 108, 176,0.5);}
.btn_cblue:focus,.btn_cblue:active{color:#fff;background-color:#1f609d;box-shadow:0 0 0 .2rem rgba(35, 108, 176,0.5);}

.btn_cgreen{color:#fff;background-color:#4fc823}
.btn_cgreen:hover{color:#fff;background-color:#47b41f;box-shadow:0 0 0 .1rem rgba(79,200,35,0.5);}
.btn_cgreen:focus,.btn_cgreen:active{color:#fff;background-color:#3fa01c;box-shadow:0 0 0 .2rem rgba(79,200,35,0.5);}

.MT4 {margin: 4px;}
.MT6 {margin: 6px;}
.MT10 {margin: 10px;}

.post-block{display: block;max-width: 100%;border: 1px dotted #aaa;border-left: 4px solid #8394b2;margin: 8px 0 0;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}
.post-block>.block-title{display: block;color: #000;max-width: 100%;margin: 0px;padding: 7px 7px;background: #E4EAF2;font-weight: bold;font-size: 11px;user-select: none;}
.post-block>.block-body{display: block;padding: 6px;max-width: 100%;background: #FAFCFE;color: #465584;word-break: break-word;}
.post-block.open>.block-title,.post-block.close>.block-title{cursor: pointer;}
.post-block.close>.block-body{display: none;}
.post-block.spoil.open>.block-title:before{content: url('data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==') " (";}
.post-block.spoil.close>.block-title:before{content: url('data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=') " (";}
.post-block.spoil>.block-title:after{content: ")";}
.post-block.spoil.open>.block-title:empty:before{content: url('data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==') " ( ИНФО";}
.post-block.spoil.close>.block-title:empty:before{content: url('data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=') " (";}
.post-block.spoil>.block-title:empty:after{content: '';}

#tooltip {background: #eeeeee;font-size: 23px;width: auto;border: 0px solid #778899;border-left: 0px;color: black;font-family: "Open Sans";text-transform: uppercase;font-weight: bold;opacity: 0.9;line-height: 30px;z-index: 1100;margin: 0px;padding: 4px;position: absolute;visibility: hidden; border-collapse: separate;}
`);

	function MonkeyConfig()
	{
		var cfg = this,
			data, params, values = {},
			storageKey, displayed, openWin, openLayer, container, overlay;

		function init(newData)
		{
			data = newData;
			if (data)
			{
				params = data.parameters || data.params;
				if (data.buttons === undefined) data.buttons = ['save', 'defaults', 'cancel'];
				if (data.width === undefined) data.width = '650px';
				if (data.scriptname === undefined) data.scriptname = 'KinozalCFG';
				if (data.title === undefined)
					if (typeof GM_getMetadata == 'function')
					{
						var scriptName = GM_getMetadata('name');
						data.title = scriptName + ' Configuration';
					}
				else data.title = 'Configuration';
			}
			var safeTitle = data && data.scriptname ? data.scriptname.replace(/[^a-zA-Z0-9]/g, '_') : '';
			storageKey = 'ScriptSettings_' + safeTitle + '_cfg';
			var storedValues;
			if (GM_getValue(storageKey)) storedValues = JSON.parse(GM_getValue(storageKey));
			for (var name in params)
			{
				if (params[name]['value'] !== undefined) set(name, params[name].value);
				else if (storedValues && storedValues[name] !== undefined) set(name, storedValues[name]);
				else if (params[name]['default'] !== undefined) set(name, params[name]['default']);
				else set(name, '');
			}
			if (data.menuCommand)
			{
				var caption = data.menuCommand !== true ? data.menuCommand : data.title;
				GM_registerMenuCommand(caption, function()
				{
					cfg.open();
				});
			}
			cfg.open = open;
			cfg.close = close;
			cfg.get = get;
			cfg.set = function(name, value)
			{
				set(name, value);
				update();
			};
		}

		function get(name)
		{
			return values[name];
		}

		function set(name, value)
		{
			values[name] = value;
		}

		function setDefaults()
		{
			for (var name in params)
			{
				if (typeof params[name]['default'] !== 'undefined')
				{
					set(name, params[name]['default']);
				}
			}
		}

		function render()
		{
			var html = '<div class="ScriptSettingsContainer"><h1 class="swal-settings-maintitle">' + data.title + '</h1><table style="width: 100%;" cellspacing="0" cellpadding="0">';
			for (var name in params)
			{
				html += MonkeyConfig.formatters['tr'](name, params[name]);
			}
			html += '<tr><th colspan="2" class="swal-settings-buttons">';
			for (var button in data.buttons)
			{
				switch (data.buttons[button])
				{
					case 'cancel':
						html += '<button type="button" class="btn_normal btn_cred MT6" id="ScriptSettingsButton_cancel">Отмена</button>';
						break;
					case 'defaults':
						html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_defaults">Ст. Наст.</button>';
						break;
					case 'save':
						html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_save">Сохранить</button>';
						break;
				}
			}
			html += "</th></tr></table><div>";
			return html;
		}

		function update()
		{
			if (!displayed) return;
			for (var name in params)
			{
				var value = values[name];
				switch (params[name].type)
				{
					case 'checkbox':
						var elem = container.querySelector('[name="' + name + '"]');
						elem.checked = !!value;
						break;
					case 'custom':
						params[name].set(value, container.querySelector('#ScriptSettingsParent_' + name));
						break;
					case 'number':
					case 'text':
					case 'color':
						var elem = container.querySelector('[name="' + name + '"]');
						elem.value = value;
						break;
					case 'select':
						var elem = container.querySelector('[name="' + name + '"]');
						if (elem.tagName.toLowerCase() == 'input')
						{
							if (elem.type && elem.type == 'radio')
							{
								elem = container.querySelector('[name="' + name + '"][value="' + value + '"]');
								elem.checked = true;
							}
							else if (elem.type && elem.type == 'checkbox')
							{
								var checkboxes = container.querySelectorAll('input[name="' + name + '"]');
								for (var i = 0; i < checkboxes.length; i++) checkboxes[i].checked = (value.indexOf(checkboxes[i].value) > -1);
							}
						}
						else if (elem.tagName.toLowerCase() == 'select')
							if (elem.multiple)
							{
								var options = container.querySelectorAll('select[name="' + name + '"] option');
								for (var i = 0; i < options.length; i++) options[i].selected = (value.indexOf(options[i].value) > -1);
							}
						else elem.value = value;
						break;
				}
			}
		}

		function saveClick()
		{
			for (var name in params)
			{
				switch (params[name].type)
				{
					case 'checkbox':
						var elem = container.querySelector('[name="' + name + '"]');
						values[name] = elem.checked;
						break;
					case 'custom':
						values[name] = params[name].get(container.querySelector('#ScriptSettingsParent_' + name));
						break;
					case 'number':
					case 'text':
					case 'color':
						var elem = container.querySelector('[name="' + name + '"]');
						values[name] = elem.value;
						break;
					case 'select':
						var elem = container.querySelector('[name="' + name + '"]');
						if (elem.tagName.toLowerCase() == 'input')
						{
							if (elem.type && elem.type == 'radio') values[name] = container.querySelector('[name="' + name + '"]:checked').value;
							else if (elem.type && elem.type == 'checkbox')
							{
								values[name] = [];
								var inputs = container.querySelectorAll('input[name="' + name + '"]');
								for (var i = 0; i < inputs.length; i++)
									if (inputs[i].checked) values[name].push(inputs[i].value);
							}
						}
						else if (elem.tagName.toLowerCase() == 'select' && elem.multiple)
						{
							values[name] = [];
							var options = container.querySelectorAll('select[name="' + name + '"] option');
							for (var i = 0; i < options.length; i++)
								if (options[i].selected) values[name].push(options[i].value);
						}
						else values[name] = elem.value;
						break;
				}
			}
			GM_setValue(storageKey, JSON.stringify(values));
			close();
			if (data.onSave) data.onSave(values);
		}

		function cancelClick()
		{
			Swal.close();
		}

		function defaultsClick()
		{
			setDefaults();
			update();
		}

		function open(mode, options)
		{
			function openDone()
			{
				var button;
				if (button = container.querySelector('#ScriptSettingsButton_save')) button.addEventListener('click', saveClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_cancel')) button.addEventListener('click', cancelClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_defaults')) button.addEventListener('click', defaultsClick, true);
				displayed = true;
				update();
			}
			switch (mode)
			{
				default:
					Swal.fire(
					{
						width: data.width,
						html: render(),
						showCancelButton: false,
						showConfirmButton: false,
						didOpen: () =>
						{
							Swal.getContent().querySelector('button#ScriptSettingsButton_save').focus();
						}
					});
					container = document.querySelector('.ScriptSettingsContainer');
					openDone();
					break;
			}
		}

		function close()
		{
			if (openWin)
			{
				openWin.close();
				openWin = undefined;
			}
			else if (openLayer)
			{
				openLayer.parentNode.removeChild(openLayer);
				openLayer = undefined;
				if (overlay)
				{
					overlay.parentNode.removeChild(overlay);
					overlay = undefined;
				}
			}
			displayed = false;
		}
		init(arguments[0]);
	}
	MonkeyConfig.esc = function(string)
	{
		return string.replace(/"/g, '&quot;');
	};
	MonkeyConfig.HTML = {
		'_field': function(name, options, data)
		{
			var html;
			if (options.type && MonkeyConfig.HTML[options.type]) html = MonkeyConfig.HTML[options.type](name, options, data);
			else return;
			if (/\[FIELD\]/.test(options.html))
			{
				html = options.html.replace(/\[FIELD\]/, html);
			}
			return html;
		},
		'_label': function(name, options, data)
		{
			var label = options['label'] || name.substring(0, 1).toUpperCase() + name.substring(1).replace(/_/g, '&nbsp;');
			return '<label for="ScriptSettings_field_' + name + '" class="swal-settings-label">' + label + '</label>';
		},
		'_title': function(name, options)
		{
			var title = (options['title'] != undefined ? '<th colspan="2" class="swal-settings-title">' + options['title'] + '</th></tr><tr>' : '');
			return title;
		},
		'checkbox': function(name, options, data)
		{
			return '<label class="checkboxToggle"><input id="ScriptSettings_field_' + name + '" name="' + name + '" type="checkbox"><b></b></label>';
		},
		'custom': function(name, options, data)
		{
			return options.html;
		},
		'number': function(name, options, data)
		{
			return '<input id="ScriptSettings_field_' + name + '" type="text" class="ScriptSettings_field_number" name="' + name + '" />';
		},
		'select': function(name, options, data)
		{
			var choices = {},
				html = '';
			if (options.choices.constructor == Array)
			{
				for (var i = 0; i < options.choices.length; i++) choices[options.choices[i]] = options.choices[i];
			}
			else choices = options.choices;
			if (!options.multiple)
			{
				if (!/^radio/.test(options.variant))
				{
					html += '<select id="ScriptSettings_field_' + name + '" class="swal-settings-select" name="' + name + '">';
					for (var value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				}
				else
				{
					for (var value in choices)
					{
						html += '<label><input type="radio" name="' + name + '" value="' + MonkeyConfig.esc(value) + '" />&nbsp;' + choices[value] + '</label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			}
			else
			{
				if (!/^checkbox/.test(options.variant))
				{
					html += '<select id="ScriptSettings_field_' + name + '" class="ScriptSettings_field_select" multiple="multiple" name="' + name + '">';
					for (var value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				}
				else
				{
					for (var value in choices)
					{
						html += '<label><input type="checkbox" name="' + name + '" value="' + MonkeyConfig.esc(value) + '" />&nbsp;' + choices[value] + '</label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			}
			return html;
		},
		'text': function(name, options, data)
		{
			if (options.long) return '<textarea id="ScriptSettings_field_' + name + '" class="swal-settings-textarea" ' + (!isNaN(options.long) ? 'rows="' + options.long + '" ' : '') + 'name="' + name + '"></textarea>';
			else return '<input id="ScriptSettings_field_' + name + '" type="text" class="swal-settings-input" name="' + name + '" />';
		},
		'color': function(name, options, data)
		{
			return '<input id="ScriptSettings_field_' + name + '" type="color" class="swal-settings-color" name="' + name + '" />';
		}
	};
	MonkeyConfig.formatters = {
		'tr': function(name, options, data)
		{
			var html = '<tr>';
			switch (options.type)
			{
				default:
					html += MonkeyConfig.HTML['_title'](name, options, data);
					html += '<td>';
					html += MonkeyConfig.HTML['_label'](name, options, data);
					html += '</td><td id="ScriptSettingsParent_' + name + '">';
					html += MonkeyConfig.HTML['_field'](name, options, data);
					html += '</td>';
					break;
			}
			html += '</tr>';
			return html;
		}
	};

	function spoilerblock(title = null, content, show = "close", titlecolor = "royalblue")
	{
		return (`<div class="post-block spoil ${show}"><div class="block-title"><span style="color:${titlecolor}">${title.toUpperCase()}</span></div><div class="block-body">${content}</div></div>`);
	}

	function copy(str)
	{
		var tmp = document.createElement('textarea'),
			focus = document.activeElement;
		tmp.value = str;
		document.body.appendChild(tmp);
		tmp.select();
		document.execCommand('copy');
		document.body.removeChild(tmp);
		focus.focus();
	}

	function truncString(str, max, add)
	{
		add = add || '...';
		return (typeof str === 'string' && str.length > max ? str.substring(0, max) + add : str);
	};

	function declOfNum(n, text_forms)
	{
		var get_number = n;
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20)
		{
			return get_number + " " + text_forms[2];
		}
		if (n1 > 1 && n1 < 5)
		{
			return get_number + " " + text_forms[1];
		}
		if (n1 == 1)
		{
			return get_number + " " + text_forms[0];
		}
		return get_number + " " + text_forms[2];
	}
	const Toast = Swal.mixin(
	{
		toast: true,
		position: 'bottom-start',
		showConfirmButton: false,
		timer: 5000,
		timerProgressBar: true,
		didOpen: (toast) =>
		{
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	});
	function fixedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}
	var get_url = location.href;
	var reg_kinozal_search = new RegExp('kinozal(\.me|\.tv|\.guru|\.website|tv\.life)\/(browse|persons|groupexreleaselist|groupex|groupextorrentlist).php', 'i');
	var reg_kinozal_detailed = new RegExp('kinozal(\.me|\.tv|\.guru|\.website|tv\.life)\/(details|comment).php', 'i');
	var reg_rutor_list = new RegExp('rutor\.(info|is)/*', 'i');
	var reg_kinopoisk = new RegExp('kinopoisk\.ru\/film\/[0-9]+\/like', 'i');
	var KinozalCFG = new MonkeyConfig(
	{
		width: "700px",
		scriptname: "kinozal",
		title: "Настройка скрипта в Кинозале"+script_version,
		menuCommand: false,
		params:
		{
			ShowConfirmDownload:
			{
				title: "Настройки<p>( Внутри раздачи )</p>",
				label: "Подтверждение действия<p>( ТОРРЕНТ и MAGNET )</p>",
				type: 'checkbox',
				default: true
			},
			ShowHelpButton:
			{
				label: "Кнопка \"Помощь\"",
				type: 'checkbox',
				default: true
			},
			DetailedInfoButtons:
			{
				label: "Сделать простыми кнопки скачивания?",
				type: 'checkbox',
				default: false
			},
			TurnOnButtons:
			{
				label: "Включить кнопки (SHIFT + 1 и т.д.)?:",
				type: 'checkbox',
				default: false
			},
			ShowTorrentButton:
			{
				title: "Главные кнопки<p>( Поиск / Раздачи персоны / Внутри раздачи )</p>",
				label: "Скачать <b>ТОРРЕНТ</b> файл",
				type: 'checkbox',
				default: true
			},
			ShowMagnetButton:
			{
				label: "Скачать через <b>MAGNET</b>",
				type: 'checkbox',
				default: true
			},
			ShowAcestreamButton:
			{
				label: "Смотреть через <b>ACESTREAM</b>",
				type: 'checkbox',
				default: false
			},
			KinopoiskLinkSearch:
			{
				title: "Настройка КиноПоиск<p>( Поиск / Раздачи персоны )</p>",
				label: "Кнопка в кинопоиске<p>Выберите каким кинозалом вы пользуетесь, что бы при нажатии на кнопку, открывался ваш кинозал</p>",
				type: 'select',
				choices: {
					kinozal1: 'kinozal.tv',
					kinozal2: 'kinozal.me',
					kinozal3: 'kinozal.guru',
					kinozal4: 'kinozaltv.life',
				},
				default: 'kinozal1'
			},
			ChangeButtonToLink:
			{
				title: "Настройка ссылок<p>( Поиск / Раздачи персоны )</p>",
				label: "Выберите вариант:<p><b>ВКЛ</b> Создаст отдельную кнопку для открытия окно с информацией<br><b>ВЫКЛ</b> При нажатии главной ссылки, откроется окошко с информацией</p>",
				type: 'checkbox',
				default: true
			},
			ChangeButtonIcon:
			{
				label: "Иконка отдельной кнопки<p>Работать будет только если <b>ВКЛ</b><br>( Больше иконок на этом сайте <a href=\"https://fontawesome.com/v4.7.0/icons/\" target=\"_blank\"><b>fontawesome.com</b></a> )</small>",
				type: 'text',
				default: "fa fa-info"
			},
			ShowFileInfo:
			{
				label: "Подробная информация о раздаче<p style=\"font-size:11px;\">Покажет подробную информацию о раздаче ( Есть ли реклама в раздаче, Скриншоты и т.д. )</p>",
				type: 'checkbox',
				default: true
			},
			ChangePersonLinks:
			{
				label: "При нажатии на имя персонажа:<p>( В окошке с информацией )</small><br><small style=\"font-size:11px;\"><b>ВКЛ</b> Искать в поиске<br><b>ВЫКЛ</b> Оставить без изминений</p>",
				type: 'checkbox',
				default: false
			},
			ShowButtonsHints:
			{
				label: "Подсказки возле кнопок скачивания<p>Убирает подсказку (Пример: Ваш рейтинг не упадёт...)</p>",
				type: 'checkbox',
				default: true
			},
			ShowMarkTorrents:
			{
				title: "Настройка меток<p>( Поиск / Раздачи персоны )</p>",
				label: "Помечать раздачи",
				type: 'checkbox',
				default: true
			},
			MarkColor:
			{
				label: "Главный Цвет",
				type: 'color',
				default: "#ff6666"
			},
			MarkBolder:
			{
				label: "Обводка текста<p style=\"font-size:11px;\">Делает чуть жирнее текст</p>",
				type: 'checkbox',
				default: false
			},
			MarkBoldColor:
			{
				label: "Цвет обводки",
				type: 'color',
				default: "#750000"
			},
			MarkTextValue:
			{
				label: "Текст метки <b>через пробел</b>",
				type: 'text',
				default: "4K 2160P 1080P BDRIP"
			},
			SwalDetailedInfoWidth:
			{
				title: "Настройка главного окна информации",
				label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
				type: 'text',
				default: "1100px"
			},
		},
		onSave: function(values)
		{
			location.reload();
		}
	});
	var RutorCFG = new MonkeyConfig(
	{
		width: "500px",
		scriptname: "rutor",
		title: "Настройка скрипта ( Кнопки скачивания )"+script_version,
		menuCommand: false,
		params:
		{
			ShowMagnetButton:
			{
				title: "Кнопки скачивания",
				label: "MAGNET кнопка",
				type: 'checkbox',
				default: true
			},
			ShowAcestreamButton:
			{
				label: "ACESTREAM кнопка",
				type: 'checkbox',
				default: true
			},
		},
		onSave: function(values)
		{
			location.reload();
		}
	});
	if (reg_kinopoisk.test(get_url))
	{
		GM_addStyle(`
.search_kinozal_button
{
background: #e4e4e3 url(https://st.kp.yandex.net/images/movies/select.gif?v=20101228-1723) -225px 0;
user-select: none;
color: #333;
font-family: tahoma, verdana;
font-size: 11px;
font-weight: bold;
text-align: center;
border: 1px #999 solid;
border-top: none;
overflow: hidden;
cursor: pointer;
display: block;
position: absolute;
padding: 5px 9px !important;
margin-top: -2px;
}
`);
		var get_kinozal_link = KinozalCFG.get('KinopoiskLinkSearch'),set_kinozal_link = "";
		if(get_kinozal_link == "kinozal1")
		{
			set_kinozal_link = "kinozal.tv";
		} else if(get_kinozal_link == "kinozal2")
		{
			set_kinozal_link = "kinozal.me";
		} else if(get_kinozal_link == "kinozal3")
		{
			set_kinozal_link = "kinozal.guru";
		} else if(get_kinozal_link == "kinozal4")
		{
			set_kinozal_link = "kinozaltv.life";
		}

		var table1 = $('#block_left_pad > ul > li:nth-child(3)');
		table1.each(function(i, e)
		{
			var get_name_first = $(e).find("h1 > a").text();
			var get_years = $(e).find("div").text().match(/([\d+]{4})/);
			$(e).append('<br><div class="search_kinozal_button" onclick="window.open(\'//'+set_kinozal_link+'/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&g=0&v=0&d=' + (get_years !== null ? get_years[1] : '0') + '&w=0&t=1&f=0\')">Искать в Кинозале</div>');
		});
		var table2 = $('table.ten_items tbody');
		table2.find("tr").each(function(i, e)
		{
			var get_name_first = $(e).find("td.news > div > div:nth-child(1) > a").text().replace(/ \(сериал\)/,"");
			var get_years = $(e).find("td.news > div > div:nth-child(1) > span").text().match(/([\d+]{4})/);
			$(e).find("td.news > div").append('<div class="search_kinozal_button" onclick="window.open(\'//'+set_kinozal_link+'/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&g=0&v=0&d=' + (get_years !== null ? get_years[1] : '0') + '&w=0&t=1&f=0\')">Искать в Кинозале</div>');
		});
	}
	if (reg_kinozal_search.test(get_url))
	{
		$("body").on("click", ".block-title", function(event)
		{
			var $this = $(this).parent(".post-block");
			if ($this.hasClass("close"))
			{
				$this.removeClass("close");
				$this.addClass("open");
			}
			else
			{
				$this.removeClass("open");
				$this.addClass("close");
			}
		});
		var get_acc_login_check = $(".bx2_0 ul.men:first li.tp2").text();
		if (get_acc_login_check.match(/Выход/))
		{
			var button_changetolink = "";
			var $tab = $('<li style="padding-left:14px;"><span class="bulet"></span><a href="javascript:void(0);" id="kinozal_search_settings" title="Настройка скрипта">Настройка скрипта</a></li>');
			$('ul.men:first').append($tab);
			$("ul.men a#kinozal_search_settings").click(function()
			{
				KinozalCFG.open();
			});
			var ChangeButtonToLink = KinozalCFG.get('ChangeButtonToLink');
			var ShowFileInfo = KinozalCFG.get('ShowFileInfo');
			var ChangePersonLinks = KinozalCFG.get('ChangePersonLinks');
			var ShowTorrentButton = KinozalCFG.get('ShowTorrentButton');
			var ShowMagnetButton = KinozalCFG.get('ShowMagnetButton');
			var ShowAcestreamButton = KinozalCFG.get('ShowAcestreamButton');
			var ShowMarkTorrents = KinozalCFG.get('ShowMarkTorrents');
			var ShowButtonsHints = KinozalCFG.get('ShowButtonsHints');
			var MarkTextValue = KinozalCFG.get('MarkTextValue');
			var MarkBolder = KinozalCFG.get('MarkBolder');
			var MarkColorValue = KinozalCFG.get('MarkColor');
			var MarkBoldColorValue = KinozalCFG.get('MarkBoldColor');
			var SwalDetailedInfoWidth = KinozalCFG.get('SwalDetailedInfoWidth');
			var ChangeButtonIcon = KinozalCFG.get('ChangeButtonIcon');
			var domain = get_url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:[^.]+\.)?([^:\/\n\?\=]+)/im)[0];
			var mgt_reg = new RegExp('[a-zA-Z0-9]{40}', 'i');
			var SwalConfirmText = "СКАЧАТЬ";
			var SwalCancelText = "ЗАКРЫТЬ";
			if (ShowMarkTorrents)
			{
				GM_addStyle("mark{" + (MarkBolder ? "text-shadow: -1px -1px 0px " + MarkBoldColorValue + ",0px -1px 0px " + MarkBoldColorValue + ",1px -1px 0px " + MarkBoldColorValue + ",1px 0px 0px " + MarkBoldColorValue + ",1px 1px 0px " + MarkBoldColorValue + ",0px 1px 0px " + MarkBoldColorValue + ",-1px 1px 0px " + MarkBoldColorValue + ",-1px 0px 0px " + MarkBoldColorValue + ";" : "") + "background: none;color: " + MarkColorValue + ";}");
				var mark_instance = new Mark(document.querySelectorAll("a.r0,a.r1,a.r2,a.r3,a.r4,a.r5,a.r6"));
				mark_instance.mark(MarkTextValue);
			}
			var table = $('.t_peer');
			var h = table.find('.mn');
			if (ChangeButtonToLink)
			{
				h.prepend('<td class="z"></td>');
			}
			table.find("tr").not(h).each(function(i, e)
			{
				var url = $(e).find('.nam a').attr('href');
				var uArgs = url.split('?')[1].split('&');
				var GetID = null;
				uArgs.forEach(function(el)
				{
					if (el.startsWith('id='))
					{
						GetID = el.split('=')[1];
					}
				});
				if (GetID !== null)
				{
					if (ChangeButtonToLink)
					{
						$(e).prepend(document.createElement('td'));
						$(e).children('td').eq(0).prepend('<button id="get_info_' + GetID + '" class="main_button_search" title="Информация о раздаче"><i class="' + ChangeButtonIcon + '"></i></button>');
					}
					else
					{
						$(e).find('.nam a').prop('id', 'get_info_' + GetID).prop('href', 'javascript:void(0);');
					}
					var get_name_from_link = $(e).find('.nam a').text().split(" / ");
					var get_name_first = get_name_from_link[0];
					var get_name_second = get_name_from_link[1];
					var GetDetailsID = null;
					var GetSrvDetailsHash = null;
					$("#get_info_" + GetID).click(async function()
					{
						$.ajax(
						{
							type: 'GET',
							url: '/details.php?id=' + GetID,
							async: false
						}).done(function(details_string)
						{
							GetDetailsID = details_string;
							return GetDetailsID;
						});
						if (GetDetailsID == null)
						{
							Toast.fire(
							{
								icon: 'warning',
								html: "Раздача с таким ID: " + GetID + " не найдена! "
							});
						}
						else
						{
							$.ajax(
							{
								url: domain + '/get_srv_details.php?id=' + GetID + '&action=2',
								async: false
							}).done(function(GetSrvDetailsString)
							{
								GetSrvDetailsHash = GetSrvDetailsString;
								return GetSrvDetailsHash;
							});
							var hash = (GetSrvDetailsHash.match(mgt_reg))[0];
							var get_ajax_rel = null;
							var get_ajax_scr = null;
							var torrent_buttons = "";
							var torrent_about_info = "";
							var magnet_buttons = "";
							var acestream_buttons = "";
							var cat_name = "";
							var download_button_hints = '<b style="color:#0000CC;">Торрент файл</b><br><b style="color:#FF0000; font-size:12px;">Внимание! Этот метод скачивания не актуален для тех, кому важен рейтинг.<br>Так как при скачивании, ваш рейтинг может понизится, тем самым возможен блок аккаунта!</b><br><b style="color:#0000CC;">MAGNET и AceStream</b><br><b style="color:#009900; font-size:12px;">Ваш рейтинг не упадёт, можете скачивать бесконечно!</b><br>';
							var gmaininfo_full = $(GetDetailsID).find("div.bx1.justify h2");
							var gmaininfo = (ChangePersonLinks ? gmaininfo_full.html().replace(/persons.php\?s=/g, "browse.php?g=1&s=").replace(/ target="_blank"/g, "") : gmaininfo_full.html());
							var gmaininfo_name = gmaininfo_full.text().match(/(Исполнитель:|Оригинальное название:|Название:|Альбом:)(.*)/)[2];
							var gmaininfo_year = gmaininfo_full.text().match(/Год выпуска: ([\d+]{4})/)[1];
							var maininfo = $(GetDetailsID).find('#tabs').html() + '<br><br>';
							var gsimilarfiles = $(GetDetailsID).find('#tabs2 td.w90p').text().match(/Подобные раздачи найдено (\d+) раздач/);
							var gsimilarfiles_href = $(GetDetailsID).find('#tabs2 td.w90p a.sba').attr('href');
							var grelscr_id = $(GetDetailsID).find("ul.lis").html();
							var grel_id = grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Релиз<\/a>/);
							var gscr_id = grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Скриншоты<\/a>/);
							var gmenuinfo = $(GetDetailsID).find(".mn1_menu ul.men").text();
							var razdajut = gmenuinfo.match(/Раздают(\d+)/);
							var skacivajut = gmenuinfo.match(/Скачивают(\d+)/);
							var skaciali = gmenuinfo.match(/Скачали(\d+)/);
							var spisokfailov = gmenuinfo.match(/Список файлов(\d+)/);
							var komentarijev = gmenuinfo.match(/Комментариев(\d+)/);
							var kinopoisk = $(GetDetailsID).find(".mn1_menu ul.men li a:contains(Кинопоиск)").attr('href');
							var get_main_img = $(GetDetailsID).find("ul.men.w200 li.img a img").attr('src');
							var gaboutfile = $(GetDetailsID).find("div.bx1.justify p").html();
							var gcat = gmaininfo.match(/src="\/pic\/cat\/(\d+).gif"/);
							var g_movie = gaboutfile.indexOf("О фильме:") !== -1;
							var img = (get_main_img !== null ? `<img src="${get_main_img}" style="display: block;margin-left: auto;margin-right: auto;padding:0px 0px 10px 0px;width: 250px;" alt="">` : '');
							var fname_youtube = get_name_first + " " + get_name_second + " " + gmaininfo_year;
							if (ChangeButtonToLink)
							{
								button_changetolink = '<button type="button" id="cancel" class="btn_small btn_cred MT4">' + SwalCancelText + '</button>';
							}
							else
							{
								button_changetolink = '<button type="button" onclick="window.open(\'details.php?id=' + GetID + '\',\'_self\')" class="btn_small btn_cblue MT4">ОТКРЫТЬ РАЗДАЧУ</button> <button type="button" id="cancel" class="btn_small btn_cred MT4">' + SwalCancelText + '</button>';
							}
							if (gcat !== null && gcat[1] == 45 || gcat !== null && gcat[1] == 46)
							{
								cat_name = "СЕРИАЛ<br>";
							}
							else if (gcat !== null && gcat[1] == 49)
							{
								cat_name = "ПЕРЕДАЧА<br>";
							}
							if (ShowFileInfo)
							{
								if (grel_id !== null)
								{
									$.ajax(
									{
										url: '/get_srv_details.php?id=' + GetID + '&pagesd=' + grel_id[1],
										async: false
									}).done(function(drel)
									{
										get_ajax_rel = drel.toLowerCase();
										return get_ajax_rel;
									});
								}
								if (gscr_id !== null)
								{
									$.ajax(
									{
										url: '/get_srv_details.php?id=' + GetID + '&pagesd=' + gscr_id[1],
										async: false
									}).done(function(dscr)
									{
										get_ajax_scr = dscr;
										return get_ajax_scr;
									});
								}
								var matchaboutfile = gaboutfile.match(/<b>.*<\/b>/)[0].replace(/(<([^>]+)>)/ig, '').replace(':', '');
								var replaceaboutfile = gaboutfile.replace(/<([^>]+)>.*<([^>]+)> /, '');
								var ads_rel = "";
								if (get_ajax_rel !== null && get_ajax_rel.match(/без.*?реклам|реклам.*?нет|реклам.*?отсутствует|дублированный|лицензия|netflix|itunes|hdrezka|ironclub|appletv/g))
								{
									ads_rel = '<p class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</p>';
								}
								else if (get_ajax_rel !== null && get_ajax_rel.match(/содержит.*?реклам|реклам.*?вставк|есть реклама|присутствуе.*?реклам|реклама.*?присутствует/g))
								{
									ads_rel = '<p class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</p>';
								}
								var similarfiles = (gsimilarfiles !== null ? '<p style="font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;"><a href="javascript:void(0);" onclick="window.open(\'browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&g=0&v=0&d=' + (gmaininfo_year !== null ? gmaininfo_year : '0') + '&w=0&t=1&f=0\',\'_self\')" style="color:red;margin-left: auto;margin-right: auto;">НАЙДЕНО ' + declOfNum(gsimilarfiles[1], ['ПОДОБНАЯ РАЗДАЧА', 'ПОДОБНЫЕ РАЗДАЧИ', 'ПОДОБНЫХ РАЗДАЧ']) + ' </a></p>' : '');
								var menuinfo = (razdajut !== null ? '<span class="menuinfo">Раздают<span class="floatright">' + razdajut[1] + '</span></span><br>' : '') + (skacivajut !== null ? '<span class="menuinfo">Скачивают<span class="floatright">' + skacivajut[1] + '</span></span><br>' : '') + (skaciali !== null ? '<span class="menuinfo">Скачали<span class="floatright">' + skaciali[1] + '</span></span><br>' : '') + (spisokfailov !== null ? '<span class="menuinfo">Список файлов<span class="floatright">' + spisokfailov[1] + '</span></span><br>' : '') + (komentarijev !== null ? '<span class="menuinfo">Комментариев<span class="floatright">' + komentarijev[1] + '</span></span><br>' : '');
								var trailer = (g_movie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(fname_youtube + ' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
								var similarmovies = (kinopoisk ? `<button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'${kinopoisk}\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК</button><button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'${kinopoisk}/like\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК ПОХОЖИЕ</button>` : '');
								var aboutfile = spoilerblock(matchaboutfile, replaceaboutfile);
								var rel_info = (get_ajax_rel !== null ? spoilerblock("Релиз", get_ajax_rel) : '');
								var scr_info = (get_ajax_scr !== null ? spoilerblock("Скриншоты", get_ajax_scr, "open", "red") : '');
							}
							if (ShowTorrentButton)
							{
								torrent_buttons = torrent_about_info + '<button type="button" class="btn_normal btn_cred MT4">СКАЧАТЬ ТОРРЕНТ ФАЙЛ</button>';
							}
							if (ShowMagnetButton)
							{
								magnet_buttons = '<button type="button" id="download_with_magnet" class="btn_normal btn_cblue MT4">СКАЧАТЬ ЧЕРЕЗ MAGNET</button><button type="button" id="copy_with_magnet" class="btn_normal btn_cblue MT4">КОПИРОВАТЬ</button>';
							}
							if (ShowAcestreamButton)
							{
								if (get_name_first.toLowerCase().match(/серии|сезон|(выпуск)|этапы|(логия)/))
								{
									var selbtn1;
									var selbtn2;
									if (get_name_first.toLowerCase().match(/(логия)/gi))
									{
										selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
										selbtn2 = "ОДИН ФИЛЬМ";
									}
									else if (get_name_first.toLowerCase().match(/(выпуск)/gi))
									{
										selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
										selbtn2 = "ОДИН ВЫПУСК";
									}
									else if (get_name_first.toLowerCase().match(/серии|сезон/gi))
									{
										selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
										selbtn2 = "ОДНА СЕРИЯ";
									}
									else if (get_name_first.toLowerCase().match(/этапы/gi))
									{
										selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
										selbtn2 = "ОДИН ЭТАП";
									}
									acestream_buttons = `<br><button type="button" id="ace_get_many_files" class="btn_normal btn_cgreen MT4">ACESTREAM ${selbtn1}</button><button type="button" id="ace_get_one_file_1" class="btn_normal btn_cgreen MT4">ACESTREAM ${selbtn2}</button>`;
								}
								else
								{
									acestream_buttons = '<button type="button" id="ace_get_one_file_2" class="btn_normal btn_cgreen MT4">ACESTREAM</button>';
								}
							}
							if (ShowFileInfo)
							{
								Swal.fire(
								{
									width: SwalDetailedInfoWidth,
									html: `
<h2 class="swal2-title fnm-title">${get_name_first}</h2>
${ads_rel}
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div style="width: 250px;">
${img}
${similarfiles}
${menuinfo}
<br>
${maininfo}
${trailer}${similarmovies}
</div></td>
<td style="vertical-align:top;padding:0px;font-size: 12px;width:100%;">
${gmaininfo}
${aboutfile}
${rel_info}
${scr_info}
</td>
</tr>
</table>
<center>
${(ShowButtonsHints ? download_button_hints : '')}${torrent_buttons}${magnet_buttons}${acestream_buttons}
</center>`,
									showCancelButton: false,
									showConfirmButton: false,
									footer: "<center>" + button_changetolink + "</center>",
									didOpen: () =>
									{
										Swal.getFooter().querySelector('button#cancel').focus();
									}
								});
							}
							else
							{
								Swal.fire(
								{
									width: SwalDetailedInfoWidth,
									html: `
<h2 class="swal2-title fnm-title">${get_name_first} / ${gmaininfo_year}</h2>
<center>
${img}
${(ShowButtonsHints ? download_button_hints : '')}${torrent_buttons}${magnet_buttons}${acestream_buttons}
</center>`,
									showCancelButton: false,
									showConfirmButton: false,
									footer: "<center>" + button_changetolink + "</center>",
									didOpen: () =>
									{
										Swal.getFooter().querySelector('button#cancel').focus();
									}
								});
							}
							$("#ace_get_many_files").on("click", async function(e)
							{
								if (get_name_first.toLowerCase().match(/серии|сезон|(выпуск)|этапы|(логия)/))
								{
									var acestream_text;
									acestream_text = "Введите количество ".toUpperCase();
									if (get_name_first.toLowerCase().match(/(логия)/gi))
									{
										acestream_text += "ФИЛЬМОВ";
									}
									else if (get_name_first.toLowerCase().match(/(выпуск)/gi))
									{
										acestream_text += "ВЫПУСКОВ";
									}
									else if (get_name_first.toLowerCase().match(/серии|сезон/gi))
									{
										acestream_text += "СЕРИЙ";
									}
									else if (get_name_first.toLowerCase().match(/этапы/gi))
									{
										acestream_text += "ЭТАПОВ";
									}
								}
								const
								{
									value: formValues
								} = await Swal.fire(
								{
									title: get_name_first,
									html: acestream_text,
									input: 'text',
									inputPlaceholder: 'Кол-во',
									inputAttributes:
									{
										min: 1,
										max: 400,
										maxlength: 3
									},
									showCancelButton: true,
									inputValidator: (value) =>
									{
										return new Promise((resolve) =>
										{
											if (!value)
											{
												resolve('Введите цифру!');
											}
											else if (isNaN(value))
											{
												resolve('Ввести можно только цифры!');
											}
											else if (value < 1 || value > 400)
											{
												resolve('Ввести можно только с 1 до 400!');
											}
											else
											{
												resolve();
											}
										});
									},
									showCloseButton: false,
									showCancelButton: false,
									showConfirmButton: true,
									confirmButtonColor: '#3085d6',
									confirmButtonText: 'Копировать'
								});
								if (formValues)
								{
									var fname = gmaininfo_name + " / " + gmaininfo_year.toUpperCase();
									if (get_name_first.match(/серии|сезон|(выпуск)|этапы/gi))
									{
										fname = get_name_first.replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)") + " / " + gmaininfo_year.toUpperCase();
									}
									$.get(domain + '/get_srv_details.php?id=' + GetID + '&action=2', function(s)
									{
										var hash = (GetSrvDetailsHash.toString().match(mgt_reg))[0].toUpperCase();
										var copy_text = "";
										var copyname = "";
										var number_copy = "";
										var i = 0;
										while (i < formValues)
										{
											var set_i = 1 + i;
											if (get_name_first.match(/(логия)/gi))
											{
												number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
												copyname = fname + " / " + set_i + "-й ФИЛЬМ";
											}
											else if (get_name_first.match(/(выпуск)/gi))
											{
												number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
												copyname = fname + " / " + set_i + " ВЫПУСК";
											}
											else if (get_name_first.match(/серии|сезон/gi))
											{
												number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
												copyname = fname + " / " + set_i + " СЕРИЯ";
											}
											else if (get_name_first.match(/этапы/gi))
											{
												number_copy = declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
												copyname = fname + " / " + set_i + " ЭТАП";
											}
											copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
											i++;
										}
										copy(copy_text);
										Toast.fire(
										{
											icon: 'success',
											title: 'СКОПИРОВАНО ' + number_copy + ' !'
										});
									});
								}
							});
							$("#ace_get_one_file_1").on("click", async function(e)
							{
								if (get_name_first.toLowerCase().match(/серии|сезон|(выпуск)|этапы|(логия)/))
								{
									var acestream_text;
									acestream_text = "Введите ".toUpperCase();
									if (get_name_first.toLowerCase().match(/(логия)/gi))
									{
										acestream_text += "ФИЛЬМ";
									}
									else if (get_name_first.toLowerCase().match(/(выпуск)/gi))
									{
										acestream_text += "ВЫПУСК";
									}
									else if (get_name_first.toLowerCase().match(/серии|сезон/gi))
									{
										acestream_text += "СЕРИЮ";
									}
									else if (get_name_first.toLowerCase().match(/этапы/gi))
									{
										acestream_text += "ЭТАП";
									}
								}
								const
								{
									value: formValues
								} = await Swal.fire(
								{
									title: get_name_first,
									html: acestream_text,
									input: 'text',
									inputPlaceholder: 'Цифра',
									inputAttributes:
									{
										min: 1,
										maxlength: 5
									},
									showCancelButton: true,
									inputValidator: (value) =>
									{
										return new Promise((resolve) =>
										{
											if (!value)
											{
												resolve('Введите цифру!');
											}
											else if (isNaN(value))
											{
												resolve('Только цифры!');
											}
											else
											{
												resolve();
											}
										});
									},
									showCloseButton: false,
									showCancelButton: false,
									showConfirmButton: true,
									confirmButtonColor: '#3085d6',
									confirmButtonText: 'Копировать'
								});
								if (formValues)
								{
									var fname = gmaininfo_name + " / " + gmaininfo_year.toUpperCase();
									if (get_name_first.match(/серии|сезон|(выпуск)|этапы/gi))
									{
										fname = get_name_first.replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)") + " / " + gmaininfo_year.toUpperCase();
									}
									$.get(domain + '/get_srv_details.php?id=' + GetID + '&action=2', function(s)
									{
										var hash = (GetSrvDetailsHash.toString().match(mgt_reg))[0].toUpperCase();
										var copyname = "";
										var number_copy = "";
										var set_i = formValues - 1;
										if (get_name_first.match(/(логия)/gi))
										{
											number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
											copyname = fname + " / " + formValues + "-й ФИЛЬМ";
										}
										else if (get_name_first.match(/(выпуск)/gi))
										{
											number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
											copyname = fname + " / " + formValues + " ВЫПУСК";
										}
										else if (get_name_first.match(/серии|сезон/gi))
										{
											number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
											copyname = fname + " / " + formValues + " СЕРИЯ";
										}
										else if (get_name_first.match(/этапы/gi))
										{
											number_copy = formValues + " ЭТАП СКОПИРОВАН !";
											copyname = fname + " / " + formValues + " ЭТАП";
										}
										copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
										Toast.fire(
										{
											icon: 'success',
											title: number_copy
										});
									});
								}
							});
							$("#download_torrent_file").on("click", function(e)
							{
								window.location.href = "/download.php?id=" + GetID;
								Toast.fire(
								{
									icon: 'success',
									title: get_name_first + ' скачивается через Торрент!'
								});
							});
							$("#download_with_magnet").on("click", function(e)
							{
								window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + fixedEncodeURIComponent(get_name_first)).substring(0, 1986);
								Toast.fire(
								{
									icon: 'success',
									title: get_name_first + ' скачивается через Magnet!'
								});
							});
							$("#copy_with_magnet").on("click", function(e)
							{
								copy("magnet:?xt=urn:btih:" + hash);
								Toast.fire(
								{
									icon: 'success',
									title: get_name_first + ' / Magnet ссылка скопирована!'
								});
							});
							$("#ace_get_one_file_2").on("click", function(e)
							{
								var year1 = get_name_from_link[1].replace(/(.*)/gi, "$1");
								var year2 = get_name_from_link[2].replace(/(.*)/gi, "$1");
								var gyear = new RegExp('^[0-9]+$').exec(get_name_from_link[1]);
								var get_name_first = get_name_from_link[0].toUpperCase();
								var fname = (gyear) ? get_name_first + " / " + year1 : get_name_first + " / " + year2;
								Toast.fire(
								{
									icon: 'success',
									title: 'Раздача ( ' + get_name_first + ' ) скопирована!'
								});
								var hash = (GetSrvDetailsHash.toString().match(mgt_reg))[0].toUpperCase();
								copy("\r\n#EXTINF:-1," + fname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
							});
							$("#cancel").on("click", function(e)
							{
								Swal.close();
							});
						}
					});
				}
			});
		}
	}
	if (reg_kinozal_detailed.test(get_url))
	{
		var get_acc_login_check = $(".bx2_0 ul.men:first li.tp2").text();
		if (get_acc_login_check.match(/Выход/))
		{
			$('ul.men:first').append('<li style="padding-left:14px;"><span class="bulet"></span><a href="javascript:void(0);" id="kinozal_detail_settings" title="Настройка скрипта">Настройка скрипта</a></li>');
			$("ul.men a#kinozal_detail_settings").click(function()
			{
				KinozalCFG.open();
			});
			var ShowConfirmDownload = KinozalCFG.get('ShowConfirmDownload');
			var ShowTorrentButton = KinozalCFG.get('ShowTorrentButton');
			var ShowMagnetButton = KinozalCFG.get('ShowMagnetButton');
			var ShowAcestreamButton = KinozalCFG.get('ShowAcestreamButton');
			var ShowHelpButton = KinozalCFG.get('ShowHelpButton');
			var TurnOnButtons = KinozalCFG.get('TurnOnButtons');
			var DetailedInfoButtons = KinozalCFG.get('DetailedInfoButtons');
			if (ShowTorrentButton || ShowMagnetButton || ShowAcestreamButton)
			{
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
				var set_buttons = document.querySelector("table.w100p");
				set_buttons.classList.add('bx1');
				if (DetailedInfoButtons)
				{
					set_buttons.innerHTML = `<tbody id="copy_form">
	<tr>
		<td class="nw">
		${(ShowTorrentButton ? ' <button id="TorrentButton" type="button" class="btn_normal btn_cred MT4">TORRENT</button>' : '')}${(ShowMagnetButton ? ' <button id="MagnetButton" type="button" class="btn_normal btn_cblue MT4">MAGNET</button>' : '')}${(ShowAcestreamButton ? ' <button id="AceStreamButton" type="button" class="btn_normal btn_cgreen MT4">ACESTREAM</button>' : '')}
		</td>
	</tr>
${(ShowHelpButton ? ' <tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : '')}
</tbody>`;
				}
				else
				{
					set_buttons.innerHTML = `<tbody id="copy_form">
	${(ShowTorrentButton ? '<tr><td style="width: 400px;" class="nw"><button id="TorrentButton" type="button" class="btn_normal btn_cred">Cкачать торрент-файл</button></td><td>' + txt_dl_torrent_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '')}
	${(ShowMagnetButton ? '<tr><td style="width: 400px;" class="nw"><button id="MagnetButton" type="button" class="btn_normal btn_cblue">Cкачать через Magnet</button></td><td>' + txt_dl_magnet_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '')}
	${(ShowAcestreamButton ? '<tr><td style="width: 400px;" class="nw"><button id="AceStreamButton" type="button" class="btn_normal btn_cgreen">ACESTREAM</button></td><td>' + txt_cp_acestream_info + '</td></tr><tr><td style="height: 4px"></td></tr>' : '')}
	${(ShowHelpButton ? '<tr><td style="height: 4px;text-align:right;">( <a href="#"><b id="help">Помощь</b></a> )</td></tr>' : '')}
</tbody>`;
				}
				document.getElementById('copy_form').addEventListener('click', async function(evt)
				{
					var target = evt.target;
					if (target.id === 'help')
					{
						Swal.fire(
						{
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
					}
					else if (target.id === 'AceStreamButton')
					{
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s)
						{
							var selbtn1 = "";
							var selbtn2 = "";
							if (gfname[0].match(/серии|сезон|(выпуск)|этапы|(логия)/g))
							{
								if (gfname[0].match(/(логия)/gi))
								{
									selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
									selbtn2 = "ОДИН ФИЛЬМ";
								}
								else if (gfname[0].match(/(выпуск)/gi))
								{
									selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
									selbtn2 = "ОДИН ВЫПУСК";
								}
								else if (gfname[0].match(/серии|сезон/gi))
								{
									selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
									selbtn2 = "ОДНА СЕРИЯ";
								}
								else if (gfname[0].match(/этапы/gi))
								{
									selbtn1 = "НЕСКОЛЬКО ЭТАПОВ";
									selbtn2 = "ОДИН ЭТАП";
								}
								Swal.fire(
								{
									title: getfname,
									html: `<center>Копировать для просмотра через AceStream<br>
<button type="button" id="1" class="btn_big btn_cblue MT10">${selbtn1}</button><button type="button" id="2" class="btn_big btn_cblue MT10">${selbtn2}</button><br>
<button type="button" id="cancel" class="btn_big btn_cred MT10">ОТМЕНА</button></center>`,
									showCancelButton: false,
									showConfirmButton: false
								});
								$("#1").on("click", async function(e)
								{
									const
									{
										value: formValues
									} = await Swal.fire(
									{
										title: getfname,
										html: 'Введите количество серий, фильмов, выпусков, этапов',
										input: 'text',
										inputPlaceholder: 'Кол-во',
										inputAttributes:
										{
											min: 1,
											max: 400,
											maxlength: 3
										},
										showCancelButton: true,
										inputValidator: (value) =>
										{
											return new Promise((resolve) =>
											{
												if (!value)
												{
													resolve('Введите цифру!')
												}
												else if (isNaN(value))
												{
													resolve('Ввести можно только цифры!')
												}
												else if (value < 1 || value > 400)
												{
													resolve('Ввести можно только с 1 до 400!')
												}
												else
												{
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
									if (formValues)
									{
										var year1 = gfname[1].replace(/(.*)/gi, "$1");
										var year2 = gfname[2].replace(/(.*)/gi, "$1");
										var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
										if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi))
										{
											var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
										}
										else
										{
											var search_gfname = getfname;
										}
										var fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
										$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s)
										{
											if (gfname[0].match(/(логия)/gi))
											{
												var number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
											}
											else if (gfname[0].match(/(выпуск)/gi))
											{
												var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
											}
											else if (gfname[0].match(/серии|сезон/gi))
											{
												var number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
											}
											else if (gfname[0].match(/этапы/gi))
											{
												var number_copy = declOfNum(formValues, ['ЭТАП', 'ЭТАПА', 'ЭТАПОВ']);
											}
											var hash = (s.toString().match(mgt_reg))[0];
											var copy_text = "";
											var i = 0;
											while (i < formValues)
											{
												var set_i = 1 + i;
												if (gfname[0].match(/(логия)/gi))
												{
													var copyname = fname + " / " + set_i + "-й ФИЛЬМ";
												}
												else if (gfname[0].match(/(выпуск)/gi))
												{
													var copyname = fname + " / " + set_i + " ВЫПУСК";
												}
												else if (gfname[0].match(/серии|сезон/gi))
												{
													var copyname = fname + " / " + set_i + " СЕРИЯ";
												}
												else if (gfname[0].match(/этапы/gi))
												{
													var copyname = fname + " / " + set_i + " ЭТАП";
												}
												copy_text += ("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
												i++;
											}
											copy(copy_text);
											Toast.fire(
											{
												icon: 'success',
												title: 'СКОПИРОВАНО ' + number_copy + ' !'
											});
										});
									}
								});
								$("#2").on("click", async function(e)
								{
									const
									{
										value: formValues
									} = await Swal.fire(
									{
										title: getfname,
										html: 'Введите серию / фильм / выпуск / этап',
										input: 'text',
										inputPlaceholder: 'Цифра',
										inputAttributes:
										{
											min: 1,
											maxlength: 5
										},
										showCancelButton: true,
										inputValidator: (value) =>
										{
											return new Promise((resolve) =>
											{
												if (!value)
												{
													resolve('Введите цифру!')
												}
												else if (isNaN(value))
												{
													resolve('Только цифры!')
												}
												else
												{
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
									if (formValues)
									{
										var year1 = gfname[1].replace(/(.*)/gi, "$1");
										var year2 = gfname[2].replace(/(.*)/gi, "$1");
										var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
										if (gfname[0].match(/серии|сезон|(выпуск)|этапы/gi))
										{
											var search_gfname = gfname[0].replace(/(.*) \((.*) .*\: .*?\)/gi, "$1 ($2 СЕЗОН)").toUpperCase();
										}
										else
										{
											var search_gfname = getfname;
										}
										fname = (gyear) ? search_gfname + " / " + year1 : search_gfname + " / " + year2;
										$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s)
										{
											var hash = (s.toString().match(mgt_reg))[0];
											var set_i = formValues - 1;
											if (gfname[0].match(/(логия)/gi))
											{
												var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
											}
											else if (gfname[0].match(/(выпуск)/gi))
											{
												var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
											}
											else if (gfname[0].match(/серии|сезон/gi))
											{
												var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
											}
											else if (gfname[0].match(/этапы/gi))
											{
												var number_copy = formValues + " ЭТАП СКОПИРОВАН !";
											}
											if (gfname[0].match(/(логия)/gi))
											{
												var copyname = fname + " / " + formValues + "-й ФИЛЬМ";
											}
											else if (gfname[0].match(/(выпуск)/gi))
											{
												var copyname = fname + " / " + formValues + " ВЫПУСК";
											}
											else if (gfname[0].match(/серии|сезон/gi))
											{
												var copyname = fname + " / " + formValues + " СЕРИЯ";
											}
											else if (gfname[0].match(/этапы/gi))
											{
												var copyname = fname + " / " + formValues + " ЭТАП";
											}
											copy("\r\n#EXTINF:-1," + copyname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
											Toast.fire(
											{
												icon: 'success',
												title: number_copy
											});
										});
									}
								});
								$("#cancel").on("click", function(e)
								{
									Swal.close();
								});
							}
							else
							{
								var year1 = gfname[1].replace(/(.*)/gi, "$1");
								var year2 = gfname[2].replace(/(.*)/gi, "$1");
								var gyear = new RegExp('^[0-9]+$').exec(gfname[1]);
								var fname = (gyear) ? getfname + " / " + year1 : getfname + " / " + year2;
								Toast.fire(
								{
									icon: 'success',
									title: 'Раздача ( ' + getfname + ' ) скопирована!'
								});
								var hash = (s.toString().match(mgt_reg))[0];
								copy("\r\n#EXTINF:-1," + fname + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
							}
						});
					}
					else if (target.id === 'MagnetButton')
					{
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s)
						{
							if (ShowConfirmDownload)
							{
								Swal.fire(
								{
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
								}).then(function(result)
								{
									var hash = (s.toString().match(mgt_reg))[0];
									if (result.isConfirmed)
									{
										window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + fixedEncodeURIComponent(getfname)).substring(0, 1986);
										Toast.fire(
										{
											icon: 'success',
											title: getfname + ' скачивается через Magnet!'
										});
									}
									else if (result.isDenied)
									{
										copy("magnet:?xt=urn:btih:" + hash + ('&dn=' + fixedEncodeURIComponent(getfname)).substring(0, 1986));
										Toast.fire(
										{
											icon: 'success',
											title: 'Magnet ссылка скопирована!'
										});
									}
								});
							}
							else
							{
								var hash = (s.toString().match(mgt_reg))[0];
								window.location.href = "magnet:?xt=urn:btih:" + hash + ('&dn=' + fixedEncodeURIComponent(getfname)).substring(0, 1986);
								Toast.fire(
								{
									icon: 'success',
									title: getfname + ' скачивается через Magnet!'
								});
							}
						});
					}
					else if (target.id === 'TorrentButton')
					{
						$.get(domain + '/get_srv_details.php?id=' + id + '&action=2', function(s)
						{
							if (ShowConfirmDownload)
							{
								Swal.fire(
								{
									title: "Скачать Торрент файл?",
									html: "Раздача:<br><b>" + getfname + "</b><br><br>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!",
									icon: 'question',
									showCancelButton: true,
									confirmButtonColor: '#4fc823',
									cancelButtonColor: '#d33',
									confirmButtonText: SwalConfirmText,
									cancelButtonText: SwalCancelText
								}).then(function(result)
								{
									if (result.value)
									{
										window.location.href = "/download.php?id=" + id;
										Toast.fire(
										{
											icon: 'success',
											title: getfname + ' скачивается через Торрент!'
										});
									}
								});
							}
							else
							{
								window.location.href = "/download.php?id=" + id;
								Toast.fire(
								{
									icon: 'success',
									title: getfname + ' скачивается через Торрент!'
								});
							}
						});
					}
				}, false);
				if (TurnOnButtons)
				{
					document.addEventListener('keydown', function(event)
					{
						if (event.code == 'Digit1' && (event.shiftKey || event.metaKey))
						{
							if (document.getElementById('TorrentButton') != null)
							{
								document.getElementById("TorrentButton").click();
							}
						}
						else if (event.code == 'Digit2' && (event.shiftKey || event.metaKey))
						{
							if (document.getElementById('MagnetButton') != null)
							{
								document.getElementById("MagnetButton").click();
							}
						}
						else if (event.code == 'Digit3' && (event.shiftKey || event.metaKey))
						{
							if (document.getElementById('AceStreamButton') != null)
							{
								document.getElementById("AceStreamButton").click();
							}
						}
					});
				}
			}
		}
	}
	if (reg_rutor_list.test(get_url))
	{
		$('#menu').append('<a href="javascript:void(0);" id="rutor_settings" class="menu_b" title="Настройка скрипта"><div>Настройка</div></a>');
		$("#menu a#rutor_settings").click(function()
		{
			RutorCFG.open();
		});
		var ShowMagnetButton = RutorCFG.get('ShowMagnetButton');
		var ShowAcestreamButton = RutorCFG.get('ShowAcestreamButton');
		var obj = this;
		var hash = document.getElementById('download').getElementsByTagName('a')[0].getAttribute("href").match(/magnet:\?xt=urn:btih:([a-z\d]{40})&/)[1];
		var GetID = document.getElementById('download').getElementsByTagName('a')[1].getAttribute("href").match(/http:\/\/d.rutor.info\/download\/(.*)/)[1];
		var set_buttons = document.querySelector("#download");
		var fname = $('div#all > H1').text().split(" / ")[0];
		var get_cat = $('table#details').text().match(/Категория(.*)/)[1];
		var get_files_count = $('table#details').text().match(/Файлы \((.*)\)/)[1];
		var get_years = $('table#details').text().match(/Год .*: ([0-9]{4})/)[1];
		var get_file_size = $('table#details').text().match(/Размер(.*)  \(.* Bytes\)/)[1];
		set_buttons.innerHTML += `<br>
<table id="copy_form">
	<tbody>
		<tr>
			<td class="nw">${ShowMagnetButton ? ' <button id="MagnetButton" type="button" class="btn_normal btn_cred MT4">MAGNET</button>' : ''}${ShowAcestreamButton ? ' <button id="AceStreamButton" type="button" class="btn_normal btn_cgreen MT4">ACESTREAM</button>' : ''}</td>
		</tr>
		<tr>
			<td colspan="2"><b style="color:#cc0000">Скрипт предназначен для копирования ссылок LIBTORRENT и ACESTREAM.<br>Скопированные ссылки вкидывайте в свой <font style="color:#00cc00">m3u8</font> плейлист</b></td>
		</tr>
	</tbody>
</table>`;
		document.getElementById('copy_form').addEventListener('click', async function(evt)
		{
			var target = evt.target;
			if (target.id === 'AceStreamButton')
			{
				if (get_files_count > 1)
				{
					if (get_cat.match(/Зарубежные фильмы|Наши фильмы|Научно-популярные фильмы/))
					{
						var selbtn1 = "НЕСКОЛЬКО ФИЛЬМОВ";
						var selbtn2 = "ОДИН ФИЛЬМ";
					}
					else if (get_cat.match(/Телевизор/))
					{
						var selbtn1 = "НЕСКОЛЬКО ПЕРЕДАЧ";
						var selbtn2 = "ОДНА ПЕРЕДАЧА";
					}
					else if (get_cat.match(/Зарубежные сериалы|Наши сериалы|Аниме/))
					{
						var selbtn1 = "НЕСКОЛЬКО СЕРИЙ";
						var selbtn2 = "ОДНА СЕРИЯ";
					}
					else
					{
						var selbtn1 = "НЕСКОЛЬКО ВЫПУСКОВ";
						var selbtn2 = "ОДИН ВЫПУСК";
					}
					var get_file_list = "";
					$.ajax(
					{
						url: '/descriptions/' + GetID + '.files',
						async: false
					}).done(function(get)
					{
						get_file_list = get;
						return get_file_list;
					});
					Swal.fire(
					{
						width: "800px",
						title: fname,
						html: `<center>Копировать для просмотра через AceStream<br>
<button type="button" id="1" class="btn_big btn_cblue MT10 MT6">${selbtn1}</button><button type="button" id="2" class="btn_big btn_cblue MT10 MT6">${selbtn2}</button><br>
<button type="button" id="cancel" class="btn_big btn_cred MT10">ОТМЕНА</button><br>
<div id="displayfiles" style="max-height:450px;overflow:auto;text-align: -webkit-center;">
	<table id="files">
		<tbody>
			<tr>
				<td>Название</td>
				<td>Размер</td>
			</tr>
		</tbody>
		<tbody id="filelist">${get_file_list}</tbody>
	</table>
</div></center>`,
						showCancelButton: false,
						showConfirmButton: false
					});
					$("#1").on("click", async function(e)
					{
						const
						{
							value: formValues
						} = await Swal.fire(
						{
							title: fname,
							html: 'Введите количество серий, фильмов, выпусков, этапов',
							input: 'text',
							inputPlaceholder: 'Кол-во',
							inputAttributes:
							{
								min: 1,
								max: 400,
								maxlength: 3
							},
							showCancelButton: true,
							inputValidator: (value) =>
							{
								return new Promise((resolve) =>
								{
									if (!value)
									{
										resolve('Введите цифру!')
									}
									else if (isNaN(value))
									{
										resolve('Ввести можно только цифры!')
									}
									else if (value < 1 || value > 400)
									{
										resolve('Ввести можно только с 1 до 400!')
									}
									else
									{
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
						if (formValues)
						{
							var copy_text = "";
							var i = 0;
							while (i < formValues)
							{
								var set_i = 1 + i;
								if (get_cat.match(/Зарубежные фильмы|Наши фильмы|Научно-популярные фильмы/))
								{
									var copyname = fname + " / " + get_years + " / " + set_i + "-й ФИЛЬМ";
									var number_copy = declOfNum(formValues, ['ФИЛЬМ', 'ФИЛЬМА', 'ФИЛЬМОВ']);
								}
								else if (get_cat.match(/Зарубежные сериалы|Наши сериалы|Аниме/))
								{
									var copyname = fname + " / " + get_years + " / " + set_i + " СЕРИЯ";
									var number_copy = declOfNum(formValues, ['СЕРИЯ', 'СЕРИЙ', 'СЕРИЙ']);
								}
								else if (get_cat.match(/Телевизор/))
								{
									var copyname = fname + " / " + get_years + " / " + set_i + " ПЕРЕДАЧА";
									var number_copy = declOfNum(formValues, ['ПЕРЕДАЧА', 'ПЕРЕДАЧИ', 'ПЕРЕДАЧ']);
								}
								else
								{
									var copyname = fname + " / " + get_years + " / " + set_i + " ВЫПУСК";
									var number_copy = declOfNum(formValues, ['ВЫПУСК', 'ВЫПУСКА', 'ВЫПУСКОВ']);
								}
								copy_text += ("\r\n#EXTINF:-1," + copyname.toUpperCase() + " / " + get_file_size + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + i + "&.mp4");
								i++;
							}
							copy(copy_text);
							Toast.fire(
							{
								icon: 'success',
								title: 'СКОПИРОВАНО ' + number_copy + ' !'
							});
						}
					});
					$("#2").on("click", async function(e)
					{
						const
						{
							value: formValues
						} = await Swal.fire(
						{
							title: fname,
							html: 'Введите серию / фильм / выпуск / этап',
							input: 'text',
							inputPlaceholder: 'Цифра',
							inputAttributes:
							{
								min: 1,
								maxlength: 5
							},
							showCancelButton: true,
							inputValidator: (value) =>
							{
								return new Promise((resolve) =>
								{
									if (!value)
									{
										resolve('Введите цифру!')
									}
									else if (isNaN(value))
									{
										resolve('Только цифры!')
									}
									else
									{
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
						if (formValues)
						{
							var set_i = formValues - 1;
							if (get_cat.match(/Зарубежные фильмы|Наши фильмы|Научно-популярные фильмы/))
							{
								var copyname = fname + " / " + get_years + " / " + formValues + "-й ФИЛЬМ";
								var number_copy = formValues + "-й ФИЛЬМ СКОПИРОВАН !";
							}
							else if (get_cat.match(/Зарубежные сериалы|Наши сериалы|Аниме/))
							{
								var copyname = fname + " / " + get_years + " / " + formValues + " СЕРИЯ";
								var number_copy = formValues + " СЕРИЯ СКОПИРОВАНА !";
							}
							else if (get_cat.match(/Телевизор/))
							{
								var copyname = fname + " / " + get_years + " / " + formValues + " ПЕРЕДАЧА";
								var number_copy = formValues + " ПЕРЕДАЧА СКОПИРОВАНА !";
							}
							else
							{
								var copyname = fname + " / " + get_years + " / " + formValues + " ВЫПУСК";
								var number_copy = formValues + " ВЫПУСК СКОПИРОВАН !";
							}
							copy("\r\n#EXTINF:-1," + copyname.toUpperCase() + " / " + get_file_size + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=" + set_i + "&.mp4");
							Toast.fire(
							{
								icon: 'success',
								title: number_copy
							});
						}
					});
					$("#cancel").on("click", function(e)
					{
						Swal.close();
					});
				}
				else
				{
					Swal.fire(
					{
						title: 'Раздача ( ' + fname + ' ) скопирована!',
						html: 'Осталось только вставить ( CTRL + V ) в свой Плейлист m3u!',
						icon: 'success',
						showCloseButton: false,
						showCancelButton: false,
						showConfirmButton: false,
						timer: 2500
					})
					copy("\r\n#EXTINF:-1," + fname.toUpperCase() + " / " + get_years + " / " + get_file_size + "\r\nhttp://127.0.0.1:6878/ace/getstream?infohash=" + hash.toUpperCase() + "&playlist_output_format_vod=hls&_idx=0&.mp4");
				}
			}
			else if (target.id === 'MagnetButton')
			{
				window.location.href = "magnet:?xt=urn:btih:" + hash.toUpperCase() + ('&dn=' + fixedEncodeURIComponent(fname)).substring(0, 1986);
				Toast.fire(
				{
					icon: 'success',
					title: 'Раздача ( ' + fname + ' ) скачивается через Magnet!'
				});
			}
		}, false);
	}
})();
