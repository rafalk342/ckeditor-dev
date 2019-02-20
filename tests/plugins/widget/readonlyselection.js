/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,toolbar,clipboard */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},
		divarea: {
			config: {
				allowedContent: true,
				extraPlugins: 'divarea'
			}
		}
	};

	var tests = {
		'test widget creation when selection starts at the end of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '<div contenteditable="false"><div>FakeWidget</div>[</div>foo]',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]'
			} ),
		'test widget reation when selection starts at the beginning of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '<div contenteditable="false">[<div>FakeWidget</div></div>foo]',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]'
			} ),
		'test widget reation when selection ends at the beginning of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '[foo<div contenteditable="false">]<div>FakeWidget</div></div>',
				expected: '[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} ),
		'test widget reation when selection ends at the end of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '[foo<div contenteditable="false"><div>FakeWidget</div>]</div>',
				expected: '[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} ),
		'test widget reation when selection starts at the end and ends at the beginning of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '<div contenteditable="false"><div>FakeWidget</div>[</div>foo<div contenteditable="false">]<div>FakeWidget</div></div>',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} ),
		'test widget reation when selection starts at the beginning and ends at the end of a widget': assertEditorSelectionOnWidgetsCreation( {
				initial: '<div contenteditable="false">[<div>FakeWidget</div></div>foo<div contenteditable="false"><div>FakeWidget</div>]</div>',
				expected: '<div contenteditable="false"><div>FakeWidget</div></div>[foo]<div contenteditable="false"><div>FakeWidget</div></div>'
			} )
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

	function assertEditorSelectionOnWidgetsCreation( options ) {
		return function( editor, bot ) {
			bot.setHtmlWithSelection( options.initial );
			var htmlString = '<div><div contenteditable="false" data-cke-widget-wrapper="true"><div>FakierWidget</div></div></div>',
				fakeWidgetContainer = CKEDITOR.dom.element.createFromHtml( htmlString ),
				fakeWidget = {
					fire: function() {},
					focus: function() {}
				},
				mocks = {
					getByElement: sinon.stub( editor.widgets, 'getByElement' ).returns( fakeWidget ),
					insertElement: sinon.stub( editor, 'insertElement' )
				},
				filter = new CKEDITOR.htmlParser.filter( {
					text: function( value ) {
						return value.replace( '{', '[' ).replace( '}', ']' );
					},
					elements: {
						br: function() {
							return false;
						}
					}
				} );

			editor.widgets.finalizeCreation( fakeWidgetContainer );
			mocks.getByElement.restore();
			mocks.insertElement.restore();

			assert.beautified.html( options.expected, bender.tools.selection.getWithHtml( editor ), { customFilters: [ filter ] } );
		};
	}
} )();
