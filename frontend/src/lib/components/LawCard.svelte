<div class="law-card details-container transition">
	<div
		class="law-card-inner">
		<div class="justify-end flex">
			<slot name="menuBar" />
		</div>
		<h4>
			<slot name="super-title" />
		</h4>
		<h2>
			<slot name="title" />
		</h2>
		<span class="sort">
			<slot name="right"></slot>
		</span>
		<div>
			<slot name="data" />
		</div>
	</div>
</div>
