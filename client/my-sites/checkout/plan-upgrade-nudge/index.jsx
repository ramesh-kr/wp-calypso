/** @format */

/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import page from 'page';
import formatCurrency from '@automattic/format-currency';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import Main from 'components/main';
import QuerySites from 'components/data/query-sites';
import QueryProductsList from 'components/data/query-products-list';
import QuerySitePlans from 'components/data/query-site-plans';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import CompactCard from 'components/card/compact';
import Button from 'components/button';
import { addItem } from 'lib/upgrades/actions';
import { planItem as getCartItemForPlan } from 'lib/cart-values/cart-items';
import getUpgradePlanSlugFromPath from 'state/selectors/get-upgrade-plan-slug-from-path';
import { getCurrentUserCurrencyCode } from 'state/current-user/selectors';
import { getSiteSlug } from 'state/sites/selectors';
import { getProductsList, isProductsListFetching } from 'state/products-list/selectors';
import { recordTracksEvent } from 'state/analytics/actions';
import { localize } from 'i18n-calypso';
import {
	isRequestingSitePlans,
	getPlansBySiteId,
	getSitePlanRawPrice,
	getPlanDiscountedRawPrice,
} from 'state/sites/plans/selectors';

/**
 * Style dependencies
 */
import './style.scss';

export class PlanUpgradeNudge extends React.Component {
	static propTypes = {
		receiptId: PropTypes.number,
		selectedSiteId: PropTypes.number.isRequired,
	};

	handleClickDecline = () => {
		const { trackUpsellButtonClick, receiptId } = this.props;
		const isRedirectedFrom = 'plan-upgrade-nudge';

		trackUpsellButtonClick( 'decline' );

		this.props.handleClickDecline( isRedirectedFrom, receiptId );
	};

	handleClickAccept = () => {
		const { siteSlug, trackUpsellButtonClick, planSlug } = this.props;

		const cartItem = getCartItemForPlan( planSlug );
		addItem( cartItem );

		trackUpsellButtonClick( 'accept' );

		page( `/checkout/${ siteSlug }` );
	};

	renderPlaceholders() {
		const { receiptId } = this.props;
		return (
			<>
				{ receiptId ? (
					<CompactCard>
						<div className="plan-upgrade-nudge__header">
							<div className="plan-upgrade-nudge__placeholders">
								<div className="plan-upgrade-nudge__placeholder-row is-placeholder" />
							</div>
						</div>
					</CompactCard>
				) : (
					''
				) }
				<CompactCard>
					<div className="plan-upgrade-nudge__placeholders">
						<>
							<div className="plan-upgrade-nudge__placeholder-row is-placeholder" />
							<div className="plan-upgrade-nudge__placeholder-row is-placeholder" />
							<div className="plan-upgrade-nudge__placeholder-row is-placeholder" />
							<div className="plan-upgrade-nudge__placeholder-row is-placeholder" />
						</>
					</div>
				</CompactCard>
				<CompactCard>
					<div className="plan-upgrade-nudge__footer">
						<div className="plan-upgrade-nudge__placeholders">
							<div className="plan-upgrade-nudge__placeholder-button-container">
								<div className="plan-upgrade-nudge__placeholder-button is-placeholder" />
								<div className="plan-upgrade-nudge__placeholder-button is-placeholder" />
							</div>
						</div>
					</div>
				</CompactCard>
			</>
		);
	}

	header() {
		const { translate } = this.props;
		return (
			<header className="plan-upgrade-nudge__small-header">
				<h2 className="plan-upgrade-nudge__title">
					{ translate( 'Hold tight, your site is being upgraded.' ) }
				</h2>
			</header>
		);
	}

	body() {
		const { translate, planRawPrice, planDiscountedRawPrice, currencyCode } = this.props;
		const bundleValue = planRawPrice * 77;
		return (
			<Fragment>
				<h2 className="plan-upgrade-nudge__header">
					{ translate( 'Do you want your site to look great?' ) }
				</h2>
				<h4 className="plan-upgrade-nudge__sub-header">
					{ translate(
						'Add {{u}}%(bundleValue)s worth{{/u}} of Premium Designs to your order {{u}}for just %(discountPrice)s{{/u}}!',
						{
							args: {
								bundleValue: formatCurrency( bundleValue, currencyCode, { precision: 0 } ),
								discountPrice: formatCurrency( planDiscountedRawPrice, currencyCode ),
							},
							components: { u: <u /> },
						}
					) }
				</h4>
				<div className="plan-upgrade-nudge__column-pane">
					<div className="plan-upgrade-nudge__column-content">
						<p>
							<b>
								{ translate(
									'According to Google, design is quite possibly the best investment you can make.'
								) }
							</b>
						</p>

						<p>
							{ translate(
								'Why? Cause based on their research, 50% of the people visiting your site decide to leave or stay within the first three seconds.'
							) }
						</p>

						<p>
							{ translate( '{{i}}Three seconds!{{/i}}', {
								components: { i: <i /> },
							} ) }
						</p>

						<p>
							{ translate(
								"Wouldn't you like a sure-fire way to make a great first impression in those 3 seconds?"
							) }
						</p>

						<p>{ translate( "Of course! And thankfully, there's a way." ) }</p>

						<p>
							{ translate(
								"Great looking sites {{b}}always{{/b}} create great first impressions and leave people wanting to know more about your site. And that's what we want, right?",
								{
									components: { b: <b /> },
								}
							) }
						</p>

						<p>
							{ translate(
								"That's exactly why we've partnered with some of the world's greatest designers to create nearly 200 high-end designs that you can use to make your site looks incredible."
							) }
						</p>

						<p>
							{ translate(
								'These premium themes are beautiful, optimized for mobile and search engines, and most importantly, they are ready to use for almost any scenario you can think of…'
							) }
						</p>

						<p>
							{ translate(
								'…small businesses, brick-and-mortar shops, boutiques, photography, clubs, portfolios, fashion, food, blogging, music, freelancing, NGOs, agencies, travel, boutiques, associations, announcements, weddings and more…'
							) }
						</p>

						<p>
							{ translate(
								'Normally, this type of premium WordPress themes {{b}}cost $100 or more each{{/b}}.',
								{
									components: { b: <b /> },
								}
							) }
						</p>

						<p>
							{ translate(
								"But because we made a bundle with all these designs inside our Premium plan, you won't pay anywhere near that much today."
							) }
						</p>

						<p>
							{ translate(
								"In fact, if you take advantage of this offer you won't even pay the full price %(fullPrice)s/yr that the Premium plan costs!",
								{
									args: {
										fullPrice: formatCurrency( planRawPrice, currencyCode ),
									},
								}
							) }{' '}
						</p>

						<p>
							{ translate(
								"Because you just purchased a brand new plan, we'll give you a one-time-only special price. Which means that you can get unlimited access to nearly 200 high-end designs for just %(discountPrice)s/yr!",
								{
									args: {
										discountPrice: formatCurrency( planDiscountedRawPrice, currencyCode ),
									},
								}
							) }
						</p>

						<p>
							{ translate(
								'Oh, and in addition to the nearly 200 beautiful site themes included, the Premium plan also comes with some really useful features that our customers truly enjoy:'
							) }
						</p>

						<ul className="plan-upgrade-nudge__checklist">
							<li className="plan-upgrade-nudge__checklist-item">
								<Gridicon icon="checkmark" className="plan-upgrade-nudge__checklist-item-icon" />
								<span className="plan-upgrade-nudge__checklist-item-text">
									{ translate(
										'Like {{b}}the ability to monetize your site{{/b}}. Yes, to make money with your site. You can sell stuff on your site without any hassle. Or make earnings through our special premium advertising program. Or why not both?',
										{
											components: { b: <b /> },
											comment: "This is a benefit listed on a 'Upgrade your plan' page",
										}
									) }
								</span>
							</li>
							<li className="plan-upgrade-nudge__checklist-item">
								<Gridicon icon="checkmark" className="plan-upgrade-nudge__checklist-item-icon" />
								<span className="plan-upgrade-nudge__checklist-item-text">
									{ translate(
										"Or like {{b}}our special tools to turn yourself into a social media pro{{/b}}. Like scheduling posts in advance (so you don't have to become a slave of social media to make it work) and our nifty promotion tools.",
										{
											components: { b: <b /> },
											comment: "This is a benefit listed on a 'Upgrade your plan' page",
										}
									) }
								</span>
							</li>
							<li className="plan-upgrade-nudge__checklist-item">
								<Gridicon icon="checkmark" className="plan-upgrade-nudge__checklist-item-icon" />
								<span className="plan-upgrade-nudge__checklist-item-text">
									{ translate(
										'Or what about the chance to {{b}}customize your premium theme to your exact needs{{/b}}? Meaning your site can be totally customized and have its unique essence, so it will never be the same as others.',
										{
											components: { b: <b /> },
											comment: "This is a benefit listed on a 'Upgrade your plan' page",
										}
									) }
								</span>
							</li>
						</ul>

						<p>
							{ translate(
								'And to top it all off, you can give the Premium plan a risk-free test drive thanks to our {{u}}30-day Money Back Guarantee{{/u}}.',
								{
									components: { u: <u /> },
								}
							) }
						</p>
						<p>
							{ translate(
								'Are you ready to get started? Go for it now, because this special one-time offer will be gone once you leave this screen.'
							) }
						</p>

						<p>
							<b>
								{ translate(
									'Upgrade to the Premium plan (with %(bundleValue)s worth of premium themes) for just {{del}}%(fullPrice)s{{/del}} %(discountPrice)s/yr.',
									{
										components: { del: <del /> },
										args: {
											bundleValue: formatCurrency( bundleValue, currencyCode, { precision: 0 } ),
											fullPrice: formatCurrency( planRawPrice, currencyCode ),
											discountPrice: formatCurrency( planDiscountedRawPrice, currencyCode ),
										},
									}
								) }
							</b>
						</p>
					</div>
					<div className="plan-upgrade-nudge__column-doodle">
						<img
							className="plan-upgrade-nudge__doodle"
							alt=""
							src="/calypso/images/illustrations/themes.svg"
						/>
					</div>
				</div>
			</Fragment>
		);
	}

	footer() {
		const { translate } = this.props;
		return (
			<footer className="plan-upgrade-nudge__footer">
				<Button
					className="plan-upgrade-nudge__decline-offer-button"
					onClick={ this.handleClickDecline }
				>
					{ translate( 'No thanks, I’ll stick with the free themes' ) }
				</Button>
				<Button
					primary
					className="plan-upgrade-nudge__accept-offer-button"
					onClick={ this.handleClickAccept }
				>
					{ translate( 'Yes, give me those Premium designs!' ) }
				</Button>
			</footer>
		);
	}

	render() {
		const {
			selectedSiteId,
			isLoading,
			hasProductsList,
			hasSitePlans,
			translate,
			receiptId,
		} = this.props;
		const title = translate( 'Checkout ‹ Plan Upgrade', {
			comment: '"Checkout" is the part of the site where a user is preparing to make a purchase.',
		} );

		return (
			<Main className="plan-upgrade-nudge">
				<PageViewTracker path="/checkout/:site/plan-upgrade-nudge/:receipt_id" title={ title } />
				<DocumentHead title={ title } />
				<QuerySites siteId={ selectedSiteId } />
				{ ! hasProductsList && <QueryProductsList /> }
				{ ! hasSitePlans && <QuerySitePlans siteId={ selectedSiteId } /> }

				{ isLoading ? (
					this.renderPlaceholders()
				) : (
					<>
						{ receiptId ? (
							<CompactCard className="plan-upgrade-nudge__card-header">
								{ this.header() }
							</CompactCard>
						) : (
							''
						) }
						<CompactCard className="plan-upgrade-nudge__card-body">{ this.body() }</CompactCard>
						<CompactCard className="plan-upgrade-nudge__card-footer">{ this.footer() }</CompactCard>
					</>
				) }
			</Main>
		);
	}
}

const trackUpsellButtonClick = buttonAction => {
	// Track calypso_upgrade_plan_upsell_decline_button_click and calypso_upgrade_plan_upsell_accept_button_click events
	return recordTracksEvent( `calypso_upgrade_plan_upsell_${ buttonAction }_button_click`, {
		section: 'checkout',
	} );
};

export default connect(
	( state, props ) => {
		const { selectedSiteId } = props;
		const productsList = getProductsList( state );
		const sitePlans = getPlansBySiteId( state ).data;
		const planSlug = getUpgradePlanSlugFromPath( state, selectedSiteId, props.product );
		const annualDiscountPrice = getPlanDiscountedRawPrice( state, selectedSiteId, planSlug, {
			isMonthly: false,
		} );
		const annualPrice = getSitePlanRawPrice( state, selectedSiteId, planSlug, {
			isMonthly: false,
		} );
		return {
			currencyCode: getCurrentUserCurrencyCode( state ),
			isLoading: isProductsListFetching( state ) || isRequestingSitePlans( state, selectedSiteId ),
			hasProductsList: Object.keys( productsList ).length > 0,
			hasSitePlans: sitePlans && sitePlans.length > 0,
			siteSlug: getSiteSlug( state, selectedSiteId ),
			planRawPrice: annualPrice,
			planDiscountedRawPrice: annualDiscountPrice,
			planSlug: planSlug,
		};
	},
	{
		trackUpsellButtonClick,
	}
)( localize( PlanUpgradeNudge ) );
