<?php
/**
 * HTML for testing the directive `data-fp-interactive`.
 *
 * @package gutenberg-test-interactive-blocks
 */
?>

<div>
	<div data-fp-show-mock="state.falseValue">
		<span data-testid="not inside an island">
			This should be shown because it is inside an island.
		</span>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div data-fp-show-mock="state.falseValue">
			<span data-testid="inside an island with json object">
				This should not be shown because it is inside an island.
			</span>
		</div>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div data-fp-show-mock="state.falseValue">
			<span data-testid="inside an island with string">
				This should not be shown because it is inside an island.
			</span>
		</div>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div data-fp-ignore>
			<div data-fp-show-mock="state.falseValue">
				<span
					data-testid="inside an inner block of an isolated island"
				>
					This should be shown because it is inside an inner
					block of an isolated island.
				</span>
			</div>
		</div>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div data-fp-interactive="tovdom-islands">
			<div
				data-fp-show-mock="state.falseValue"
				data-testid="island inside another island"
			>
				<span>
					This should not have two template wrappers because
					that means we hydrated twice.
				</span>
			</div>
		</div>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div>
			<div
				data-fp-interactive="tovdom-islands"
				data-fp-ignore
			>
				<div data-fp-show-mock="state.falseValue">
					<span
						data-testid="island inside inner block of isolated island"
					>
						This should not be shown because even though it
						is inside an inner block of an isolated island,
						it's inside an new island.
					</span>
				</div>
			</div>
		</div>
	</div>

	<div data-fp-interactive="tovdom-islands">
		<div data-fp-interactive="something-new"></div>
		<div data-fp-show-mock="state.falseValue">
			<span data-testid="directive after different namespace">
				The directive above should keep the `tovdom-island` namespace,
				so this message should not be visible.
			</span>
		</div>
	</div>
</div>
